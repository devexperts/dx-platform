/**
 * @typedef {Object} TThrottlingOptions
 * @property {Boolean} [leading]
 * @property {Boolean} [trailing]
 */

/**
 * Returns a function, that, when invoked, will only be triggered at most once during a given window of time.
 * Normally, the throttled function will run as much as it can, without ever going more than once per wait
 * duration; but if you’d like to disable the execution on the leading edge, pass {leading: false}.
 * To disable execution on the trailing edge, pass {trailing: false}.
 */
export default function throttle<F extends Function>(func: F, wait: any = 0, options: any = {}): F {
	let context: any;
	let args: any;
	let result: any;
	let timeout: any = null;
	let previous: any = 0;

	const later = () => {
		previous = options.leading === false ? 0 : Date.now();
		timeout = null;
		result = func.apply(context, args);

		if (!timeout) {
			context = args = null;
		}
	};

	return function (this: any) {
		const now = Date.now();
		if (!previous && options.leading === false) {
			previous = now;
		}

		const remaining = wait - (now - previous);
		context = this; //eslint-disable-line consistent-this
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			result = func.apply(context, args);

			if (!timeout) {
				context = args = null;
			}
		} else if (!timeout && options.trailing !== false) {
			timeout = setTimeout(later, remaining);
		}
		return result;
	} as any;
}

/**
 * Class method decorator for {@link throttle}.
 */
export function THROTTLE(wait = 0, options = {}): any {
	return function (target: any, prop: any, descriptor?: any): any {
		if (descriptor) {
			if (descriptor.initializer) {
				const old = descriptor.initializer;
				descriptor.initializer = function initializer() {
					return throttle(old.call(this), wait, options);
				};
			} else if (descriptor.get) {
				descriptor.get = throttle(descriptor.get, wait, options);
			} else if (descriptor.value) {
				descriptor.value = throttle(descriptor.value, wait, options);
			}
			return descriptor;
		} else {
			throw new Error('Property decorators are not implemented yet!');
		}
	};
}