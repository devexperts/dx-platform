import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT';
import { MonadTask, MonadTask1, MonadTask2, MonadTask2C, MonadTask3 } from 'fp-ts/lib/MonadTask';

export interface Subscription {
	readonly unsubscribe: () => void;
}

export interface Observer<A> {
	readonly next: (a: A) => void;
	readonly end: () => void;
}

export interface Observable<A> {
	readonly subscribe: (observer: Observer<A>) => Subscription;
}

export interface MonadObservable<M> extends MonadTask<M> {
	readonly fromObservable: <A>(observable: Observable<A>) => HKT<M, A>;
}

export interface MonadObservable1<M extends URIS> extends MonadTask1<M> {
	readonly fromObservable: <A>(observable: Observable<A>) => Kind<M, A>;
}

export interface MonadObservable2<M extends URIS2> extends MonadTask2<M> {
	readonly fromObservable: <E, A>(observable: Observable<A>) => Kind2<M, E, A>;
}

export interface MonadObservable2C<M extends URIS2, E> extends MonadTask2C<M, E> {
	readonly fromObservable: <A>(observable: Observable<A>) => Kind2<M, E, A>;
}

export interface MonadObservable3<M extends URIS3> extends MonadTask3<M> {
	readonly fromObservable: <R, E, A>(observable: Observable<A>) => Kind3<M, R, E, A>;
}
