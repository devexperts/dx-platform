/**
 * @type {Symbol}
 */
export const MEMOIZE_CLEAR_FUNCTION = Symbol('MEMOIZE_CLEAR_FUNCTION') as symbol;

/**
 * Memoizes function for passed arguments
 */
export function memoize<F extends Function>(this: any, fn: F): F {
	const storage = {};
	const result = function(this: any) {
		const args = Array.prototype.slice.call(arguments);
		const key = serialize(args);
		if (typeof storage[key] === 'undefined') {
			storage[key] = fn.apply(this, args as any);
		}
		return storage[key];
	}.bind(this);

	//inject clearer
	result[MEMOIZE_CLEAR_FUNCTION] = function() {
		const args = Array.prototype.slice.call(arguments);
		const key = serialize(args);
		delete storage[key];
	};

	return result as any;
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

export function memoOnce<Args extends unknown[], R>(f: (...args: Args) => R): (...args: Args) => R {
	let hasValue = false;
	let cachedR: R;
	let cachedArgs: Args = [] as any;
	const update = (args: Args): void => {
		cachedR = f(...args);
		hasValue = true;
		cachedArgs = args;
	};
	return (...args: Args): R => {
		const length = args.length;
		if (hasValue && length === 0) {
			return cachedR;
		}
		if (!hasValue || cachedArgs.length !== length) {
			update(args);
			return cachedR;
		}
		for (let i = 0; i < length; i++) {
			if (cachedArgs[i] !== args[i]) {
				update(args);
				return cachedR;
			}
		}
		return cachedR;
	};
}
