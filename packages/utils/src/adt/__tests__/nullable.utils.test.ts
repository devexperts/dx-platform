import { getEq, getOrd, nullable, Nullable } from '../nullable.utils';
import { Arbitrary, constant, float, oneof } from 'fast-check';
import { applicative, apply, eq, functor, monad, ord } from 'fp-ts-laws';
import { eqNumber } from 'fp-ts/lib/Eq';
import { ordNumber } from 'fp-ts/lib/Ord';

export const lift = <A>(a: Arbitrary<A>): Arbitrary<Nullable<A>> =>
	oneof(constant(null), constant(undefined), a.map(nullable.of));

describe('Nullable utils', () => {
	describe('laws', () => {
		it('Eq', () => eq(getEq(eqNumber), lift(float())));
		it('Ord', () => ord(getOrd(ordNumber), lift(float())));
		it('Functor', () => functor(nullable)(lift, getEq));
		it('Apply', () => apply(nullable)(lift, getEq));
		it('Applicative', () => applicative(nullable)(lift, getEq));
		it('Monad', () => monad(nullable)(getEq));
	});
});
