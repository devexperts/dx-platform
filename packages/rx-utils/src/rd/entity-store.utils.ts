import { ObservableMap } from '../observable-map.utils';
import { Observable, ReplaySubject, of } from 'rxjs';
import { RemoteData, remoteData, isSuccess, success } from '@devexperts/remote-data-ts';
import { sequence } from 'fp-ts/lib/Traversable';
import { array } from 'fp-ts/lib/Array';
import { constant, Predicate } from 'fp-ts/lib/function';
import { isNotNullable } from '@devexperts/utils/dist/object/object';
import { LiveData } from './live-data.utils';
import { filter, map, distinctUntilChanged, shareReplay, switchMap, tap, multicast, refCount } from 'rxjs/operators';
import { tapRD } from './operators/tapRD';
import { mapRD } from './operators/mapRD';
import { switchMapRD } from './operators/switchMapRD';

export class EntityStore<L = never, A = never> {
	/**
	 * Returns all values of current store.
	 * By default returns Observable<RemoteData<L, A[]>>, but can be overwritten by "getAllValues$" setter.
	 *
	 */
	get getAllValues$(): any {
		return this._getAllValues$;
	}

	/**
	 * Overwrites default return-value for "getAllValues$" getter.
	 *
	 */
	set getAllValues$(value: any) {
		this._getAllValues$ = value;
	}
	private readonly cache = new ObservableMap<string, RemoteData<L, A>>();
	private readonly cachedStreams = new Map<string, LiveData<L, A>>();
	private hasLoadedAll = false;
	private isLoadingAll = false;
	private _getAllValues$ = this.cache.values$.pipe(
		filter(() => !this.isLoadingAll && this.hasLoadedAll),
		map(data => data.filter(item => item.isSuccess())),
		map(sequence(remoteData, array)),
		distinctUntilChanged(),
		shareReplay(1),
	);

	readonly keys$ = this.cache.keys$;

	/**
	 * Returns entity by a key.
	 * If there is no data by a key it triggers "get" argument to receive data and put it in a cache.
	 *
	 * @param key - Key (name) of an entity you want to receive.
	 *
	 * @param get - Describes how to receive data if cache by key is empty. Typically it's an API call.
	 *
	 * @returns - Returns a LiveData stream with requested entity.
	 */
	get(key: string, get: () => LiveData<L, A>): LiveData<L, A> {
		let sharedGetter: Observable<RemoteData<L, A>> | undefined = this.cachedStreams.get(key);

		if (!isNotNullable(sharedGetter)) {
			const hasValue = this.cache.has(key);
			const cachedValue = this.cache.getValue(key);
			const valueIsResolved = isNotNullable(cachedValue) && isSuccess(cachedValue);
			if (hasValue && valueIsResolved) {
				return this.cache.get(key);
			}

			sharedGetter = new Observable<RemoteData<L, A>>(observer => {
				const getterSubscription = get().subscribe(value => {
					this.cache.set(key, value);
				});

				const cacheSubscription = this.cache.get(key).subscribe(value => {
					observer.next(value);
				});

				return () => {
					getterSubscription.unsubscribe();
					cacheSubscription.unsubscribe();
					this.cachedStreams.delete(key);
				};
			}).pipe(multicast(new ReplaySubject<RemoteData<L, A>>(1)), refCount());

			this.cachedStreams.set(key, sharedGetter);
		}

		return sharedGetter;
	}

	/**
	 * Triggers receiving all entities using "partialGetAll" argument and put them in a cache.
	 *
	 * @param pk - Means "Primary Key". Describes how to get a key from an entity (required for "updateCache").
	 *
	 * @param partialGetAll - Describes how to get all values for current entity store. Typically it's an API call.
	 *
	 * @param predicate - Predicate to filter "partialGetAll" result. E.g. you want to filter invalid entities or you have a business case - use only data created before 01.01.2018.
	 *
	 * @returns - Returns a LiveData stream with requested entities.
	 */
	getAll(
		pk: (value: A) => string,
		partialGetAll: () => LiveData<L, A[]>,
		predicate?: Predicate<A>,
	): LiveData<L, A[]> {
		this.isLoadingAll = false;
		return partialGetAll().pipe(
			tapRD(values => {
				this.hasLoadedAll = true;
				this.updateCache(values, pk);
			}),
			switchMap(data => {
				const data$ = constant(of(data));
				return data.foldL(data$, data$, data$, () => this._getAllValues$);
			}),
			distinctUntilChanged(),
			mapRD(entities => {
				if (typeof predicate === 'undefined') {
					return entities;
				}
				let hasChanges = false;
				const filtered = entities.filter(value => {
					const result = predicate(value);
					if (!result) {
						hasChanges = true;
					}
					return result;
				});
				return hasChanges ? filtered : entities;
			}),
			shareReplay(1),
		);
	}

	/**
	 * Remove an entity from current entity store.
	 *
	 * @param key - Key of an entity you want to remove. Using only in optimistic scenario, but required all the time.
	 *
	 * @param pk - Means "Primary Key". Describes how to get a key from an entity (required for "updateCache").
	 *
	 * @param remove - Describes how to remove an entity. Typically it's an API call. Should returns an array of existing entities. Exception should be handled inside this stream.
	 *
	 * @param optimistic - The flag - is optimistic scenario or not, true by default. If true, entity will be removed from a cache before an API call.
	 *
	 * @returns - Returns a LiveData stream with existing entities.
	 */
	remove(
		key: string,
		pk: (value: A) => string,
		remove: () => LiveData<L, A[]>,
		optimistic: boolean = true,
	): LiveData<L, A[]> {
		if (optimistic) {
			this.cache.delete(key);
		}
		return remove().pipe(
			tapRD(values => {
				this.updateCache(values, pk);
			}),
			switchMap(() => this._getAllValues$),
		);
	}

	/**
	 * Create an entity
	 *
	 * @param pk - Means "Primary Key". Describes how to get a key from an entity (required for "updateCache").
	 *
	 * @param create - Describes how to create an entity. Returns a stream with a created entity.
	 *
	 * @returns - Returns a LiveData stream with created entity.
	 */
	create(pk: (value: A) => string, create: () => LiveData<L, A>): LiveData<L, A> {
		return create().pipe(
			switchMapRD(value => {
				const key = pk(value);
				this.cache.set(key, success(value));
				return this.cache.get(key);
			}),
		);
	}

	/**
	 * Update an entity
	 *
	 * @param key - Key for an entity you want to update.
	 *
	 * @param update - Describes how to update an entity. Returns a stream with updated entity. Typically it's an API call.
	 *
	 * @returns - Returns a LiveData stream with updated entity.
	 */
	update(key: string, update: () => LiveData<L, A>): LiveData<L, A> {
		return update().pipe(
			tap(value => {
				if (value.isSuccess()) {
					this.cache.set(key, value);
				}
			}),
		);
	}

	private updateCache(values: A[], pk: (value: A) => string): void {
		const entries = values.map<[string, RemoteData<L, A>]>(item => [pk(item), success(item)]);
		this.cache.setMany(entries);
	}
}
