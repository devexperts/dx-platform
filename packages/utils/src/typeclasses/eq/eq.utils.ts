import { Eq, strictEqual } from 'fp-ts/lib/Eq';
import { shallowEqual } from '../../object/fb';

export const eqUnknown: Eq<unknown> = {
	equals: strictEqual,
};

export const eqShallow: Eq<unknown> = {
	equals: shallowEqual,
};
