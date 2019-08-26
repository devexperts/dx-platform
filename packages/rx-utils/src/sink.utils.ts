import { EMPTY, merge, Observable } from 'rxjs';
import { Monad1 } from 'fp-ts/lib/Monad';
import { sequenceT } from 'fp-ts/lib/Apply';
import { Monoid } from 'fp-ts/lib/Monoid';
import { Semigroup } from 'fp-ts/lib/Semigroup';

export const URI = 'Sink';
export type URI = typeof URI;

declare module 'fp-ts/lib/HKT' {
	interface URItoKind<A> {
		Sink: Sink<A>;
	}
}

export class Sink<A> {
	readonly _A!: A;
	readonly _URI!: typeof URI;

	constructor(readonly value: A, readonly sink$: Observable<unknown> = EMPTY) {}

	map<B>(f: (a: A) => B): Sink<B> {
		return new Sink(f(this.value), this.sink$);
	}

	ap<B>(fab: Sink<(a: A) => B>): Sink<B> {
		return new Sink(fab.value(this.value), merge(fab.sink$, this.sink$));
	}

	chain<B>(f: (a: A) => Sink<B>): Sink<B> {
		const fb = f(this.value);
		return new Sink(fb.value, merge(fb.sink$, this.sink$));
	}
}

export const getSemigroup = <A>(S: Semigroup<A>): Semigroup<Sink<A>> => ({
	concat: (x, y) => new Sink(S.concat(x.value, y.value), merge(x.sink$, y.sink$)),
});

export const getMonoid = <A>(M: Monoid<A>): Monoid<Sink<A>> => ({
	...getSemigroup(M),
	empty: new Sink(M.empty, EMPTY),
});

const of = <A>(value: A): Sink<A> => new Sink(value);
const map = <A, B>(fa: Sink<A>, f: (a: A) => B): Sink<B> => fa.map(f);
const ap = <A, B>(fab: Sink<(a: A) => B>, fa: Sink<A>): Sink<B> => fa.ap(fab);
const chain = <A, B>(fa: Sink<A>, f: (a: A) => Sink<B>): Sink<B> => fa.chain(f);

export const sink: Monad1<URI> = {
	URI,
	of,
	map,
	ap,
	chain,
};

export const sequenceTSink = sequenceT(sink);
