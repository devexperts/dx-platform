import { URIS, URIS2 } from 'fp-ts/lib/HKT';
import {
	MonadObservable,
	MonadObservable1,
	MonadObservable2,
} from '@devexperts/utils/dist/typeclasses/monad-observable/monad-observable';
import { useEffect, useMemo } from 'react';
import { constVoid } from 'fp-ts/lib/function';
import { Sink1, Sink2, Sink } from '@devexperts/utils/dist/adt/sink.utils';

const observerVoid = {
	next: constVoid,
	end: constVoid,
};

export function useSink<M extends URIS2>(
	M: MonadObservable2<M>,
): <A>(factory: () => Sink2<M, A>, dependencies: unknown[]) => A;
export function useSink<M extends URIS>(
	M: MonadObservable1<M>,
): <A>(factory: () => Sink1<M, A>, dependencies: unknown[]) => A;
export function useSink<M>(M: MonadObservable<M>): <A>(factory: () => Sink<M, A>, dependencies: unknown[]) => A;
export function useSink<M>(M: MonadObservable<M>): <A>(factory: () => Sink<M, A>, dependencies: unknown[]) => A {
	return (factory, dependencies) => {
		const sa = useMemo(factory, dependencies);
		useEffect(() => {
			const subscription = M.subscribe(sa.effects, observerVoid);
			return () => subscription.unsubscribe();
		}, [sa]);
		return sa.value;
	};
}
