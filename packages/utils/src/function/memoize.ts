/**
 * @type {Symbol}
 */
export const MEMOIZE_CLEAR_FUNCTION = Symbol('MEMOIZE_CLEAR_FUNCTION') as symbol;

/**
 * Memoizes function for passed arguments
 */
export function memoize<A>(
	this: any,
	fn: () => A,
): {
	(): A;
	[key: string]: () => A;
};
export function memoize<A, B>(
	this: any,
	fn: (a: A) => B,
): {
	(a: A): B;
	[key: string]: (a: A) => B;
};
export function memoize<A, B, C>(
	this: any,
	fn: (a: A, b: B) => C,
): {
	(a: A, b: B): C;
	[key: string]: (a: A, b: B) => C;
};
export function memoize<A, B, C, D>(
	this: any,
	fn: (a: A, b: B, c: C) => D,
): {
	(a: A, b: B, c: C): D;
	[key: string]: (a: A, b: B, c: C) => D;
};
export function memoize<A, B, C, D, E>(
	this: any,
	fn: (a: A, b: B, c: C, d: D) => E,
): {
	(a: A, b: B, c: C, d: D): E;
	[key: string]: (a: A, b: B, c: C, d: D) => E;
};
export function memoize<A, B, C, D, E, F>(
	this: any,
	fn: (a: A, b: B, c: C, d: D, e: E) => F,
): {
	(a: A, b: B, c: C, d: D, e: E): F;
	[key: string]: (a: A, b: B, c: C, d: D, e: E) => F;
};
export function memoize<A, B, C, D, E, F, G>(
	this: any,
	fn: (a: A, b: B, c: C, d: D, e: E, f: F) => G,
): {
	(a: A, b: B, c: C, d: D, e: E, f: F): G;
	[key: string]: (a: A, b: B, c: C, d: D, e: E, f: F) => G;
};
export function memoize<A, B, C, D, E, F, G, H>(
	this: any,
	fn: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H,
): {
	(a: A, b: B, c: C, d: D, e: E, f: F, g: G): H;
	[key: string]: (a: A, b: B, c: C, d: D, e: E, f: F, g: G) => H;
} {
	const storage = {};
	const result = function(this: any) {
		const args = Array.prototype.slice.call(arguments);
		const key = serialize(args);
		if (typeof storage[key] === 'undefined') {
			storage[key] = fn.apply(this, args);
		}
		return storage[key];
	}.bind(this);

	//inject clearer
	result[MEMOIZE_CLEAR_FUNCTION] = function() {
		const args = Array.prototype.slice.call(arguments);
		const key = serialize(args);
		delete storage[key];
	};

	return result;
}

export default memoize;

/**
 * @param {Array.<*>} args
 * @returns {String}
 */
function serialize(args: any[]): string {
	const argsAreValid = args.every(arg => {
		return typeof arg === 'number' || typeof arg === 'string' || typeof arg === 'boolean';
	});
	if (!argsAreValid) {
		throw Error('Arguments to memoized function can only be strings or numbers');
	}
	return JSON.stringify(args);
}
