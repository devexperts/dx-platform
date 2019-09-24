import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';

export const getTransition = (...properties: NonEmptyArray<string>): string =>
	properties.map(property => `${property} 200ms ease`).join(', ');
