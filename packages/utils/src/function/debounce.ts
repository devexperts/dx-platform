/**
 * Returns a function, that, as long as it continues to be invoked, will not be triggered.
 * The function will be called after it stops being called for N milliseconds.
 * If immediate is passed, trigger the function on the leading edge, instead of the trailing.
 */
export default function debounce<F extends Function>(func: F, wait: number = 0, immediate: boolean = false): F {
	let timeout: any;
	let args: any;
	let context: any;
	let timestamp: any;
	let result: any;

	const later = () => {
		const last = Date.now() - timestamp;

		if (last < wait && last >= 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			if (!immediate) {
				result = func.apply(context, args);

				if (!timeout) {
					context = args = null;
				}
			}
		}
	};

	return function (this: any) {
		context = this;
		args = arguments;
		timestamp = Date.now();
		const callNow = immediate && !timeout;

		if (!timeout) {
			timeout = setTimeout(later, wait);
		}

		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	} as any;
}

/**
 * Class method decorator for {@link debounce}.
 */
export function DEBOUNCE(wait: number = 0, immediate: boolean = false): any {
	return function (target: any, prop: any, descriptor?: any): any {
		if (descriptor) {
			if (descriptor.initializer) {
				const old = descriptor.initializer;
				descriptor.initializer = function initializer() {
					return debounce(old.call(this), wait, immediate);
				};
			} else if (descriptor.get) {
				descriptor.get = debounce(descriptor.get, wait, immediate);
			} else if (descriptor.value) {
				descriptor.value = debounce(descriptor.value, wait, immediate);
			}
			return descriptor;
		} else {
			throw new Error('Property decorators are not implemented yet!');
		}
	};
}