import {
	MonadObservable,
	MonadObservable1,
	MonadObservable2,
	MonadObservable2C,
	MonadObservable3,
} from '@devexperts/utils/dist/typeclasses/monad-observable/monad-observable';
import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT';
import { useMemo, useState } from 'react';
import { useSubscription } from './use-subscription';

export function useObservable<M extends URIS3>(
	M: MonadObservable3<M>,
): <R, E, A>(fa: Kind3<M, R, E, A>, initial: A) => A;
export function useObservable<M extends URIS2, E>(M: MonadObservable2C<M, E>): <A>(fa: Kind2<M, E, A>, initial: A) => A;
export function useObservable<M extends URIS2>(M: MonadObservable2<M>): <E, A>(fa: Kind2<M, E, A>, initial: A) => A;
export function useObservable<M extends URIS>(M: MonadObservable1<M>): <A>(fa: Kind<M, A>, initial: A) => A;
export function useObservable<M>(M: MonadObservable<M>): <A>(fa: HKT<M, A>, initial: A) => A;
export function useObservable<M>(M: MonadObservable<M>): <A>(fa: HKT<M, A>, initial: A) => A {
	const useSubscriptionM = useSubscription(M);
	return (fa, initial) => {
		const [value, setValue] = useState(() => initial);
		const updater = useMemo(
			() =>
				M.map(fa, a => {
					setValue(() => a);
					return a;
				}),
			[fa, setValue],
		);
		useSubscriptionM(updater);
		return value;
	};
}
