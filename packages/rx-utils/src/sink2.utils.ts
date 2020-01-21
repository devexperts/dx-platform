import { merge } from 'rxjs';
import { Monad1 } from 'fp-ts/lib/Monad';
import { pipeable } from 'fp-ts/lib/pipeable';
import { sequenceT } from 'fp-ts/lib/Apply';
import { array } from 'fp-ts/lib/Array';
import { Semigroup } from 'fp-ts/lib/Semigroup';
import { Monoid } from 'fp-ts/lib/Monoid';
import { getSink, Sink1 } from '@devexperts/utils/dist/adt/sink.utils';
import { instanceObservable } from './observable.utils';

export interface Sink<A> extends Sink1<typeof instanceObservable.URI, A> {}
const sinkObservable = getSink(instanceObservable);
export const newSink = sinkObservable.newSink;

export const URI = '@devexperts/rx-utils//Sink';
export type URI = typeof URI;
declare module 'fp-ts/lib/HKT' {
	interface URItoKind<A> {
		[URI]: Sink<A>;
	}
}

export const instanceSink: Monad1<URI> = {
	URI,
	...sinkObservable,
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
