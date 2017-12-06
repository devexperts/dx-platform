import { ObjectClean, ObjectOmit } from 'typelevel-ts';

export { is, shallowEqual } from './fb';
import { is, hasOwnProperty } from './fb';

/**
 * Generates new object with keys mapped with template
 */
export function mapKeys<T extends {}>(object: T, template: (key: string) => string): T {
	return Object.keys(object).reduce<T>((acc, key) => {
		acc[template(key)] = object[key];
		return acc;
	}, {} as T);
}

/**
 * Deeply compares two objects
 * @param {*} objA
 * @param {*} objB
 * @returns {Boolean}
 */
export function deepEqual(objA: object, objB: object): boolean {
	if (is(objA, objB)) {
		return true;
	}

	if (typeof objA !== 'object' || objA === null ||
		typeof objB !== 'object' || objB === null) {
		return false;
	}

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	// Test for A's keys different from B.
	for (let i = 0, len = keysA.length; i < len; i++) {
		if (
			!hasOwnProperty.call(objB, keysA[i]) ||
			!deepEqual(objA[keysA[i]], objB[keysA[i]])
		) {
			return false;
		}
	}

	return true;
}

export type PartialKeys<T extends {}, K extends keyof T> = ObjectOmit<T, K> & Partial<Pick<T, K>>;