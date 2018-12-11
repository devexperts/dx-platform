import { Setoid, strictEqual } from 'fp-ts/lib/Setoid';

export const setoidStrict: Setoid<unknown> = {
	equals: strictEqual,
};
