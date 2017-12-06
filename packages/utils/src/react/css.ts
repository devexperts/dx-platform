import { CSS_DECORATOR_STORAGE } from './__private__/shared';

/**
 * Indicates that lifecycle method is overridden by {@link @CSS} decorator
 * @type {Symbol}
 */
const CSS_DECORATOR_OVERRIDE_MARKER = Symbol('CSS_DECORATOR_OVERRIDE_MARKER');

const CONTEXT = {};

/**
 * CSS decorator
 */
export function CSS(cssModule = {}): any {
	console.warn('CSS decorator is deprecated. Use react-css-themr');
	return function (target: any): any {
		//noinspection JSUnresolvedVariable
		const oldComponentWillMount = target.prototype.componentWillMount;
		//noinspection JSUnresolvedVariable
		const oldComponentWillUpdate = target.prototype.componentWillUpdate;
		//noinspection JSUnresolvedVariable
		const oldComponentWillUnmount = target.prototype.componentWillUnmount;

		//get parent class css module
		//prototype read is chained so we'll get parent's class css module
		const parentCss = target.prototype[CSS_DECORATOR_STORAGE];

		//mix parent with current css module and set on current prototype
		//prototype assignment is not chained - so we'll set only on current prototype
		const original = target.prototype[CSS_DECORATOR_STORAGE] = concatObjectValues(parentCss, cssModule);

		//create lifecycle methods

		/**
		 * componentWillMount
		 */
		function componentWillMount(this: any) {
			//if this is CONTEXT then we are manually called from child's componentWillMount
			//extract child's context as this.context
			const context = extractContext(this);

			//noinspection JSValidateTypes
			if (this !== CONTEXT) {
				//we are called either as usual from react lifecycle
				//or manually wuth custom context but we are in original target class
				context.css = concatObjectValues(original, context.props.css);
			}

			//call old version of function if exists
			if (oldComponentWillMount) {
				oldComponentWillMount.call(composeContext(oldComponentWillMount, context));
			}
		}

		//mark method as overridden to check it further before composing context to call original method
		overrideMethod(componentWillMount);

		/**
		 * componentWillUpdate
		 * @param {{}} newProps
		 */
		function componentWillUpdate(this: any, newProps: {}) {
			const context = extractContext(this);
			//noinspection JSValidateTypes
			if (this !== CONTEXT) {
				this.css = concatObjectValues(original, newProps['css']);
			}
			if (oldComponentWillUpdate) {
				oldComponentWillUpdate.call(composeContext(oldComponentWillUpdate, context), newProps);
			}
		}

		overrideMethod(componentWillUpdate);

		/**
		 * componentWillUnmount
		 */
		function componentWillUnmount(this: any) {
			const context = extractContext(this);
			//noinspection JSValidateTypes
			if (this !== CONTEXT) {
				delete this['css'];
			}
			if (oldComponentWillUnmount) {
				oldComponentWillUnmount.call(composeContext(oldComponentWillUnmount, context));
			}
		}

		overrideMethod(componentWillUnmount);

		//inject react lifecycle methods to prototype
		target.prototype.componentWillMount = componentWillMount;
		target.prototype.componentWillUpdate = componentWillUpdate;
		target.prototype.componentWillUnmount = componentWillUnmount;
	};
}

/**
 * Merges second object into first by concatinating values with same keys
 * @param {{}} object1
 * @param {{}} [object2={}]
 * @returns {{}}
 */
function concatObjectValues(object1: {}, object2 = {}) {
	const result = Object.assign({}, object1);
	Object.keys(object2).forEach(key => {
		if (result[key]) {
			result[key] = `${result[key] || ''} ${object2[key]}`;
		} else {
			result[key] = object2[key];
		}
	});
	return result;
}

/**
 * @param {*} context
 * @returns {{}}
 */
function extractContext(context: {}) {
	return context === CONTEXT ? context['context'] : context;
}

function composeContext<F extends Function>(method: F, context: {}) {
	//we need to detect if old method is overridden to work with custom context
	if (method[CSS_DECORATOR_OVERRIDE_MARKER]) {
		//call in special context to differ from usual call
		return Object.assign(CONTEXT, {
			context
		});
	}
	return context;
}

function overrideMethod<F extends Function>(method: F) {
	method[CSS_DECORATOR_OVERRIDE_MARKER] = true;
}