import { Eq, strictEqual } from 'fp-ts/lib/Eq';

export const eqUnknown: Eq<unknown> = {
	equals: strictEqual,
};
