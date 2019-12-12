import {
	boolean,
	brand,
	Branded,
	intersection,
	Mixed,
	number,
	OutputOf,
	string,
	Type,
	TypeOf,
	union,
	null as iotsNull,
	Validation,
	ValidationError,
	Context,
	success,
	failure,
} from 'io-ts';
import { Ord } from 'fp-ts/lib/Ord';
import { setFromArray } from 'io-ts-types/lib/setFromArray';
import { Either, mapLeft } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { last } from 'fp-ts/lib/Array';
import { fold } from 'fp-ts/lib/Option';

export const reportIfFailed = <A>(validation: Validation<A>): Either<Error, A> =>
	pipe(
		validation,
		mapLeft(e =>
			pipe(
				last(e),
				fold(
					() => new Error('Validation failure should contain at least one error'),
					e => new Error(getMessage(e)),
				),
			),
		),
	);

function getMessage(e: ValidationError) {
	return e.message !== undefined
		? e.message
		: createMessage(e.context) + '\n in context: \n' + getContextPath(e.context);
}

function createMessage(context: Context) {
	return (
		'\n Received: \n  ' +
		JSON.stringify(context[context.length - 1].actual) +
		'\n expected: \n  ' +
		context[context.length - 1].type.name +
		'\n in field \n  ' +
		context[context.length - 1].key
	);
}

function getContextPath(context: Context) {
	return context
		.map(function(cEntry, index) {
			const padding = new Array(index * 2 + 2).fill(' ').join('');
			return (
				padding + cEntry.key + (index > 0 ? ': ' : '') + cEntry.type.name.replace(/([,{])/g, '$1 \n' + padding)
			);
		})
		.join(' -> \n');
}

export interface Codec<A> extends Type<A, unknown> {}

export interface IntegerBrand {
	readonly Integer: unique symbol;
}
export type Integer = Branded<number, IntegerBrand>;
export const integer: Codec<Integer> = brand(
	number,
	(n): n is Integer => n !== -Infinity && n !== Infinity && Math.floor(n) === n,
	'Integer',
);

export interface NonNegativeBrand {
	readonly NonNegative: unique symbol;
}
export type NonNegative = Branded<number, NonNegativeBrand>;
export const nonNegative: Codec<NonNegative> = brand(number, (n): n is NonNegative => n >= 0.0, 'NonNegative');

export interface PositiveBrand {
	readonly Positive: unique symbol;
}
export type Positive = Branded<number, PositiveBrand>;
export const positive: Codec<Positive> = brand(number, (n): n is Positive => n > 0.0, 'Positive');

export type Natural = NonNegative & Integer;
export const natural: Codec<Natural> = intersection([nonNegative, integer], 'Natural');

export interface NonEmptySetBrand {
	readonly NonEmptySet: unique symbol;
}
export type NonEmptySet<A> = Branded<Set<A>, NonEmptySetBrand>;
export const nonEmptySetFromArray = <C extends Mixed>(
	codec: C,
	ord: Ord<TypeOf<C>>,
): Type<NonEmptySet<TypeOf<C>>, OutputOf<C>[]> =>
	brand(setFromArray(codec, ord), (s): s is NonEmptySet<TypeOf<C>> => s.size > 0, 'NonEmptySet');

export type JSONPrimitive = string | number | boolean | null;
export const JSONPrimitiveCodec: Codec<JSONPrimitive> = union([string, number, boolean, iotsNull]);

export interface FractionBrand {
	readonly Fraction: unique symbol;
}
export type Fraction = Branded<number, FractionBrand>;
export const fraction = brand(number, (n): n is Fraction => true, 'Fraction');
export const fractionFromPercentage = (a: Percentage): Either<Error, Fraction> =>
	reportIfFailed(fraction.decode(a / 100));

export interface PercentageBrand {
	readonly Percentage: unique symbol;
}
export type Percentage = Branded<number, PercentageBrand>;
export const percentage = brand(number, (n): n is Percentage => true, 'Percentage');
export const percentageFromFraction = (a: Fraction): Either<Error, Percentage> =>
	reportIfFailed(percentage.decode(a * 100));

type LiteralValue = string | number | boolean;

export const mapper = <A extends LiteralValue, O extends LiteralValue>(
	decoded: A,
	encoded: O,
	name: string = `${decoded} <-> ${encoded}`,
) =>
	new Type(
		name,
		(u): u is A => u === decoded,
		(u, c) => (u === encoded ? success(decoded) : failure(u, c)),
		() => encoded,
	);
