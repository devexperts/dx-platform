import { BehaviorSubject, Observable } from 'rxjs';
import { isNotNullable } from '@devexperts/utils/dist/object/object';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';

type UninitializedEntity<V> = {
	hasValue: false;
	subject: BehaviorSubject<V | undefined>;
	observable: Observable<V>;
};

type InitializedEntity<V> = {
	hasValue: true;
	subject: BehaviorSubject<V>;
	observable: Observable<V>;
};

type ObservableMapEntity<V> = UninitializedEntity<V> | InitializedEntity<V>;

type InitializedEntry<K, V> = [K, InitializedEntity<V>];
type ObservableMapEntry<K, V> = [K, ObservableMapEntity<V>];

export class ObservableMap<K, V> {
	private cache = new Map<K, ObservableMapEntity<V>>();
	private allSubject$ = new BehaviorSubject<void>(undefined);

	private isInTransaction = false;
	private hasChanges = false;

	private _keys$ = new BehaviorSubject<K[]>([]);
	readonly keys$ = this._keys$.asObservable();

	readonly values$: Observable<V[]> = this.allSubject$.pipe(
		map(() => {
			const values = Array.from(this.cache.values());
			return values.filter(isInitialized).map(entity => entity.subject.getValue());
		}),
		shareReplay(1),
	);
	readonly entries$: Observable<[K, V][]> = this.allSubject$.pipe(
		map(() => {
			const entries = Array.from(this.cache.entries()).filter(isEntryInitialized);
			return entries.map<[K, V]>(entry => [entry[0], entry[1].subject.getValue()]);
		}),
		shareReplay(1),
	);

	get size(): number {
		return this.cache.size;
	}

	get isEmpty(): boolean {
		return this.size === 0;
	}

	private handleKeys = (keys: K[]) => this._keys$.next(keys);

	has(key: K): boolean {
		return this.cache.has(key);
	}

	get(key: K): Observable<V> {
		return this.getOrCreateCached(key).observable;
	}

	getValue(key: K): V | undefined {
		if (this.cache.has(key)) {
			const value = this.cache.get(key);
			if (isNotNullable(value) && value.hasValue) {
				return value.subject.getValue();
			}
		}
	}

	set(key: K, value: V): void {
		this.transaction(() => {
			const isCachedKey = this.cache.has(key);
			let cached = this.getOrCreateCached(key);
			if (cached.hasValue === false) {
				cached = initializeEntity(cached);
				this.cache.set(key, cached);
				if (!isCachedKey) {
					this.handleKeys(Array.from(this.cache.keys()));
				}
			}

			if (cached.subject.getValue() !== value) {
				cached.subject.next(value);
				this.hasChanges = true;
			}
		});
	}

	setMany(entries: [K, V][]): void {
		this.transaction(() => {
			entries.forEach(entry => {
				const [key, value] = entry;
				this.set(key, value);
			});
		});
	}

	transaction(thunk: () => void): void {
		if (!this.isInTransaction) {
			this.isInTransaction = true;
			thunk();
			if (this.hasChanges) {
				this.hasChanges = false;
				this.allSubject$.next(undefined);
			}
			this.isInTransaction = false;
		} else {
			// execute the thunk, notifications will be handled by parent transaction
			thunk();
		}
	}

	delete(key: K): void {
		this.transaction(() => {
			const isCachedKey = this.cache.has(key);
			this.cache.delete(key);
			if (isCachedKey) {
				this.handleKeys(Array.from(this.cache.keys()));
			}
			this.hasChanges = true;
		});
	}

	deleteMany(keys: K[]): void {
		this.transaction(() => {
			keys.forEach(key => {
				this.delete(key);
			});
		});
	}

	clear(): void {
		this.transaction(() => {
			this.cache.clear();
			this.handleKeys(Array.from(this.cache.keys()));
			this.hasChanges = true;
		});
	}

	private getOrCreateCached(key: K): ObservableMapEntity<V> {
		const cached = this.cache.get(key);
		if (cached) {
			return cached;
		}

		const subject = new BehaviorSubject<V | undefined>(undefined);
		const observable = subject.pipe(
			filter(isNotNullable),
			distinctUntilChanged(),
		);
		const entity: ObservableMapEntity<V> = {
			hasValue: false,
			subject,
			observable,
		};
		this.cache.set(key, entity);
		return entity;
	}
}

function initializeEntity<V>(entity: UninitializedEntity<V>): InitializedEntity<V> {
	return {
		...entity,
		hasValue: true,
	} as any; //unsafe cast because hasValue indicates that BehaviorSubject does not hold undefined values
}

function isInitialized<V>(entity: ObservableMapEntity<V>): entity is InitializedEntity<V> {
	return entity.hasValue;
}

function isEntryInitialized<K, V>(entry: ObservableMapEntry<K, V>): entry is InitializedEntry<K, V> {
	return isInitialized(entry[1]);
}
