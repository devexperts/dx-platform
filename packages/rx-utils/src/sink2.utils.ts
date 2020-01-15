import { EMPTY, merge, Observable } from 'rxjs';
import { Monad1 } from 'fp-ts/lib/Monad';
import { pipeable } from 'fp-ts/lib/pipeable';
import { sequenceT } from 'fp-ts/lib/Apply';
import { array } from 'fp-ts/lib/Array';
import { Semigroup } from 'fp-ts/lib/Semigroup';
import { Monoid } from 'fp-ts/lib/Monoid';

export interface Sink<A> {
	readonly effects: Observable<unknown>;
	readonly value: A;
}
export const newSink = <A>(value: A, effects: Observable<unknown>): Sink<A> => ({ value, effects });

export const URI = '@devexperts/rx-utils//Sink';
export type URI = typeof URI;
declare module 'fp-ts/lib/HKT' {
	interface URItoKind<A> {
		[URI]: Sink<A>;
	}
}

export const instanceSink: Monad1<URI> = {
	URI,
	map: (fa, f) => newSink(f(fa.value), fa.effects),
	ap: (fab, fa) => newSink(fab.value(fa.value), merge(fab.effects, fa.effects)),
	of: a => newSink(a, EMPTY),
	chain: (fa, f) => {
		const fb = f(fa.value);
		return newSink(fb.value, merge(fa.effects, fb.effects));
	},
};

const getSemigroup = <A>(S: Semigroup<A>): Semigroup<Sink<A>> => ({
	concat: (x, y) => newSink(S.concat(x.value, y.value), merge(x.effects, y.effects)),
});

const getMonoid = <A>(M: Monoid<A>): Monoid<Sink<A>> => ({
	...getSemigroup(M),
	empty: instanceSink.of(M.empty),
});

export const sink = {
	...instanceSink,
	...pipeable(instanceSink),
	sequenceT: sequenceT(instanceSink),
	sequenceArray: array.sequence(instanceSink),
	getSemigroup,
};
