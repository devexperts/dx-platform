import { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/lib/HKT';
import {
	MonadObservable,
	MonadObservable1,
	MonadObservable2,
	MonadObservable2C,
} from '@devexperts/utils/dist/typeclasses/monad-observable/monad-observable';
import { useEffect, useMemo } from 'react';
import { Observer } from '@devexperts/utils/src/typeclasses/monad-observable/monad-observable';
import { constVoid } from 'fp-ts/lib/function';

const voidObserver: Observer<unknown> = {
	next: constVoid,
	end: constVoid,
};

export function useSubscription<M extends URIS2, E>(M: MonadObservable2C<M, E>): <A>(fa: Kind2<M, E, A>) => void;
export function useSubscription<M extends URIS2>(M: MonadObservable2<M>): <E, A>(fa: Kind2<M, E, A>) => void;
export function useSubscription<M extends URIS>(M: MonadObservable1<M>): <A>(fa: Kind<M, A>) => void;
export function useSubscription<M>(M: MonadObservable<M>): <A>(fa: HKT<M, A>) => void;
export function useSubscription<M>(M: MonadObservable<M>): <A>(fa: HKT<M, A>) => void {
	return fa => {
		const subscription = useMemo(() => M.subscribe(fa, voidObserver), [fa]);
		useEffect(() => () => subscription.unsubscribe());
	};
}
