/**
 * @type {Symbol}
 */
export const MEMOIZE_CLEAR_FUNCTION = Symbol('MEMOIZE_CLEAR_FUNCTION');

/**
 * Memoizes function for passed arguments
 */
export function memoize<A>(this: any, fn: () => A): () => A;
export function memoize<A, B>(this: any, fn: (a: A) => B): (a: A) => B;
export function memoize<A, B, C>(this: any, fn: (a: A, b: B) => C): (a: A, b: B) => C;
export function memoize<A, B, C, D>(this: any, fn: (a: A, b: B, c: C) => D): (a: A, b: B, c: C) => D;
export function memoize<A, B, C, D, E>(this: any, fn: (a: A, b: B, c: C, d: D) => E): (a: A, b: B, c: C, d: D) => E {
	const storage = {};
	const result = function (this: any) {
		const args = Array.prototype.slice.call(arguments);
		const key = serialize(args);
		if (typeof storage[key] === 'undefined') {
			storage[key] = fn.apply(this, args);
		}
		return storage[key];
	}.bind(this);

	//inject clearer
	result[MEMOIZE_CLEAR_FUNCTION] = function () {
		const args = Array.prototype.slice.call(arguments);
		const key = serialize(args);
		delete storage[key];
	};

	return result;
}

export default memoize;

/**
 * Decorator for {@link memoize} function
 * @param {Object} target
 * @param {String} property
 * @param {Object} descriptor
 * @returns {Object} descriptor
 */
export function MEMOIZE(target: any, property: any, descriptor: any): any {
	if (descriptor.initializer) {
		//noinspection JSDuplicatedDeclaration
		const old = descriptor.initializer;
		descriptor.initializer = function initializer(): any {
			return memoize(old.call(this)) as any;
		};
	} else if (descriptor.get) {
		descriptor.get = memoize(descriptor.get);
	} else if (descriptor.value) {
		descriptor.value = memoize(descriptor.value);
	}
	return descriptor;
}

/**
 * @param {Array.<*>} args
 * @returns {String}
 */
function serialize(args: any[]): string {
	const argsAreValid = args.every(arg => {
		return typeof arg === 'number' || typeof arg === 'string';
	});
	if (!argsAreValid) {
		throw Error('Arguments to memoized function can only be strings or numbers');
	}
	return JSON.stringify(args);
}