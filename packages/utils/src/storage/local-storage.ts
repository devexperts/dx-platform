import { Type } from 'io-ts';
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT';
import {
	Adapter,
	Adapter1,
	Adapter2,
	Adapter3,
	MonadObservable,
	MonadObservable1,
	MonadObservable2,
	MonadObservable3,
} from '../typeclasses/monad-observable/monad-observable';
import { MonadReader } from '../typeclasses/monad-reader/monad-reader.utils';
import { Filterable, Filterable1, Filterable2, Filterable3 } from 'fp-ts/lib/Filterable';
import { Semigroup } from 'fp-ts/lib/Semigroup';
import { fromEither, getOrElse, none, Option } from 'fp-ts/lib/Option';

export type LocalStorageContext = {
	localStorage: Storage;
	window: EventTarget & WindowEventHandlers;
};

export type LocalStorageClient<F> = {
	readonly getItem: <A>(
		S: Semigroup<HKT<F, A>>,
	) => (key: string, codec: Type<A, unknown>, defaultValue: A) => Adapter<F, A>;
};
export type LocalStorageClient1<F extends URIS> = {
	readonly getItem: <A>(
		S: Semigroup<Kind<F, A>>,
	) => (key: string, codec: Type<A, unknown>, defaultValue: A) => Adapter1<F, A>;
};
export type LocalStorageClient2<F extends URIS2> = {
	readonly getItem: <E, A>(
		S: Semigroup<Kind2<F, E, A>>,
	) => (key: string, codec: Type<A, unknown>, defaultValue: A) => Adapter2<F, E, A>;
};
export type LocalStorageClient3<F extends URIS3> = {
	readonly getItem: <R, E, A>(
		S: Semigroup<Kind3<F, R, E, A>>,
	) => (key: string, codec: Type<A, unknown>, defaultValue: A) => Adapter3<F, R, E, A>;
};

export function localStorageClient<R extends URIS2, M extends URIS3>(
	R: MonadReader<R>,
	M: MonadObservable3<M> & Filterable3<M>,
): Kind2<R, LocalStorageContext, LocalStorageClient3<M>>;
export function localStorageClient<R extends URIS2, M extends URIS2>(
	R: MonadReader<R>,
	M: MonadObservable2<M> & Filterable2<M>,
): Kind2<R, LocalStorageContext, LocalStorageClient2<M>>;
export function localStorageClient<R extends URIS2, M extends URIS>(
	R: MonadReader<R>,
	M: MonadObservable1<M> & Filterable1<M>,
): Kind2<R, LocalStorageContext, LocalStorageClient1<M>>;
export function localStorageClient<R extends URIS2, M>(
	R: MonadReader<R>,
	M: MonadObservable<M> & Filterable<M>,
): Kind2<R, LocalStorageContext, LocalStorageClient<M>>;
export function localStorageClient<R extends URIS2, M>(
	R: MonadReader<R>,
	M: MonadObservable<M> & Filterable<M>,
): Kind2<R, LocalStorageContext, LocalStorageClient<M>> {
	return R.asks(e => {
		const storageEvent = M.fromEvent(e.window, 'storage');
		return {
			getItem: <A>(S: Semigroup<HKT<M, A>>) => (
				key: string,
				codec: Type<A, unknown>,
				defaultValue: A,
			): Adapter<M, A> => {
				const initial = getOrElse(() => defaultValue)(getValue(e.localStorage.getItem(key), codec));
				const value = M.filterMap(storageEvent, e => (e.key !== key ? none : getValue(e.newValue, codec)));
				const [nextLocal, local] = M.createAdapter<A>();
				const next = (value: A) => {
					try {
						e.localStorage.setItem(key, JSON.stringify(codec.encode(value)));
						nextLocal(value);
					} catch {}
				};
				return [next, S.concat(S.concat(value, M.of(initial)), local)];
			},
		};
	});
}

const getValue = <A, O, I>(value: string | null, codec: Type<A, O, I>): Option<A> => {
	if (value === null) {
		return none;
	}
	try {
		return fromEither(codec.decode(JSON.parse(value)));
	} catch {
		return none;
	}
};
