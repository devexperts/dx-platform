import { Monad1 } from 'fp-ts/lib/Monad';
import { Alternative1 } from 'fp-ts/lib/Alternative';
import { constUndefined, identity } from 'fp-ts/lib/function';
import { pipeable } from 'fp-ts/lib/pipeable';
import { Eq } from 'fp-ts/lib/Eq';
import { Ord } from 'fp-ts/lib/Ord';
import { Traversable1 } from 'fp-ts/lib/Traversable';
import { Applicative } from 'fp-ts/lib/Applicative';
import { HKT } from 'fp-ts/lib/HKT';

export const URI = 'Nullable';
export type URI = typeof URI;

export type None = null | undefined;
export type Some<A> = A;
export type Nullable<A> = Some<A> | None;

declare module 'fp-ts/lib/HKT' {
	interface URItoKind<A> {
		Nullable: Nullable<A>;
	}
}

export const some: <A>(a: A) => A = identity;
export const none: None = undefined;
export const isNone = <A>(a: Nullable<A>): a is null | undefined => a === null || a === undefined;
export const isSome = <A>(a: Nullable<A>): a is NonNullable<A> => a !== null && a !== undefined;
export const getOrElse = <A>(a: () => A) => (fa: Nullable<A>): A => (isSome(fa) ? fa : a());

export const getEq = <A>(E: Eq<A>): Eq<Nullable<A>> => ({
	equals: (x, y) => x === y || (isNone(x) ? isNone(y) : isNone(y) ? false : E.equals(x, y)),
});
export const getOrd = <A>(O: Ord<A>): Ord<Nullable<A>> => ({
	equals: getEq(O).equals,
	compare: (x, y) => (x === y ? 0 : isSome(x) ? (isSome(y) ? O.compare(x, y) : 1) : -1),
});

export const nullable: Monad1<URI> & Alternative1<URI> & Traversable1<URI> = {
	URI,
	map: (fa, f) => (isSome(fa) ? f(fa) : (fa as any)),
	ap: (fab, fa) => (isSome(fab) ? (isSome(fa) ? fab(fa) : fa) : (fab as any)),
	of: identity,
	chain: (fa, f) => (isSome(fa) ? f(fa) : (fa as any)),
	alt: (fx, fy) => (isSome(fx) ? fx : fy()),
	zero: constUndefined,
	reduce: (fa, b, f) => (isNone(fa) ? b : f(b, fa)),
	foldMap: M => (fa, f) => (isNone(fa) ? M.empty : f(fa)),
	reduceRight: (fa, b, f) => (isNone(fa) ? b : f(fa, b)),
	traverse: <F>(F: Applicative<F>) => <A, B>(ta: Nullable<A>, f: (a: A) => HKT<F, B>): HKT<F, Nullable<B>> => {
		return isNone(ta) ? F.of(none) : F.map(f(ta), some);
	},
	sequence: <F>(F: Applicative<F>) => <A>(ta: Nullable<HKT<F, A>>): HKT<F, Nullable<A>> => {
		return isNone(ta) ? F.of(none) : F.map(ta, some);
	},
};

const { alt, ap, apFirst, apSecond, chain, chainFirst, flatten, map } = pipeable(nullable);
export { alt, ap, apFirst, apSecond, chain, chainFirst, flatten, map };
