import { getEq, getOrd, isNone, none, nullable, Nullable, some } from '../nullable.utils';
import { Arbitrary, assert, constant, float, oneof, property } from 'fast-check';
import { applicative, apply, eq, functor, monad, ord } from 'fp-ts-laws';
import { eqNumber } from 'fp-ts/lib/Eq';
import { ordNumber } from 'fp-ts/lib/Ord';
import { constNull, constUndefined, identity } from 'fp-ts/lib/function';
import { Applicative1, ApplicativeComposition11, getApplicativeComposition } from 'fp-ts/lib/Applicative';

const lift = <A>(a: Arbitrary<A>): Arbitrary<Nullable<A>> =>
	oneof(constant(null), constant(undefined), a.map(nullable.of));
const nullableFloat = lift(float());
const double = (n: number) => n * 2;
const eqNullableNumber = getEq(eqNumber);

declare module 'fp-ts/lib/HKT' {
	interface URItoKind<A> {
		NullableNullable: Nullable<Nullable<A>>;
	}
}
const nullableNullable: Applicative1<'NullableNullable'> & ApplicativeComposition11<'Nullable', 'Nullable'> = {
	URI: 'NullableNullable',
	...getApplicativeComposition(nullable, nullable),
};

describe('Nullable utils', () => {
	describe('laws', () => {
		it('Eq', () => eq(eqNullableNumber, nullableFloat));
		it('Ord', () => ord(getOrd(ordNumber), nullableFloat));
		it('Functor', () => functor(nullable)(lift, getEq));
		it('Apply', () => apply(nullable)(lift, getEq));
		it('Applicative', () => applicative(nullable)(lift, getEq));
		it('Monad', () => monad(nullable)(getEq));
		it('Foldable', () => {
			const left = nullable.reduce;
			const right = <A, B>(u: Nullable<A>, x: B, f: (acc: B, x: A) => B) =>
				nullable.reduce(u, [], (acc: A[], y: A): A[] => acc.concat([y])).reduce(f, x);

			assert(
				property(nullableFloat, n => {
					expect(left<number, number[]>(n, [], (acc, b) => acc.concat([b]))).toEqual(
						right<number, number[]>(n, [], (acc, b) => acc.concat([b])),
					);
				}),
			);
		});
		describe('Traversable', () => {
			const t = nullable.traverse(nullable);
			const s = nullable.sequence(nullable);
			it('Naturality', () => {
				const f = oneof<(n: Nullable<number>) => Nullable<number>>(
					constant(n => nullable.chain(n, constNull)),
					constant(n => nullable.chain(n, constUndefined)),
					constant(n => nullable.map(n, double)),
				);

				// check f
				assert(
					property(f, float(), (f, a) =>
						eqNullableNumber.equals(nullable.map(f(a), double), f(nullable.map(a, double))),
					),
				);

				// check law
				assert(property(f, nullableFloat, (f, u) => eqNullableNumber.equals(f(t(u, identity)), t(u, f))));
			});
			it('Identity', () => {
				assert(
					property(nullableFloat, u => {
						expect(eqNullableNumber.equals(t(u, nullable.of), nullable.of(u))).toBeTruthy();
					}),
				);
			});
			it('Composition', () => {
				assert(
					property(nullableFloat, u =>
						eqNullableNumber.equals(
							nullable.traverse(nullableNullable)(u, identity),
							nullableNullable.map(t(u, identity), v => t(v, identity)),
						),
					),
				);
			});
			it('edge case', () => {
				assert(property(nullableFloat, n => eqNullableNumber.equals(s(n), some(n))));
			});
		});
	});
	it('edge case with compactable arrays', () => {
		// Compactable based on Nullable istead of Option
		const compact = <A>(as: Nullable<A>[]): A[] =>
			as.reduce<A[]>((acc, a) => (isNone(a) ? acc : acc.concat(a)), []);
		expect(compact([some(1), some(2)])).toEqual([1, 2]);
		expect(compact([some(1), none])).toEqual([1]);
		expect(compact([some(1), some(none)])).toEqual([1]);
		expect(compact([some(1), some(some(none))])).toEqual([1]);
	});
});
