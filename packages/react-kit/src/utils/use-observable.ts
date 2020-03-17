import {
	MonadObservable,
	MonadObservable1,
	MonadObservable2,
	MonadObservable2C,
	MonadObservable3,
} from '@devexperts/utils/dist/typeclasses/monad-observable/monad-observable';
import { HKT, URIS, Kind, URIS2, Kind2, URIS3, Kind3 } from 'fp-ts/lib/HKT';
import { useEffect, useMemo, useState } from 'react';
import { constVoid } from 'fp-ts/lib/function';

export function useObservable<M extends URIS3>(
	M: MonadObservable3<M>,
): <R, E, A>(fa: Kind3<M, R, E, A>, initial: A) => A;
export function useObservable<M extends URIS2, E>(M: MonadObservable2C<M, E>): <A>(fa: Kind2<M, E, A>, initial: A) => A;
export function useObservable<M extends URIS2>(M: MonadObservable2<M>): <E, A>(fa: Kind2<M, E, A>, initial: A) => A;
export function useObservable<M extends URIS>(M: MonadObservable1<M>): <A>(fa: Kind<M, A>, initial: A) => A;
export function useObservable<M>(M: MonadObservable<M>): <A>(fa: HKT<M, A>, initial: A) => A;
export function useObservable<M>(M: MonadObservable<M>): <A>(fa: HKT<M, A>, initial: A) => A {
	return (fa, initial) => {
		const [value, setValue] = useState(() => initial);
		const subscription = useMemo(
			() =>
				M.subscribe(fa, {
					next: a => setValue(() => a),
					end: constVoid,
				}),
			[fa, setValue],
		);
		useEffect(() => () => subscription.unsubscribe(), [subscription]);
		return value;
	};
}
