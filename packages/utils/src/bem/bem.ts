/**
 * @typedef {string|number} TBemPlainModifier
 */

/**
 * @typedef {Array.<TBemPlainModifier>} TBemNormalizedModifiers
 */

/**
 * @typedef {Object.<TBemPlainModifier, boolean>} TBemKeyModifiers
 */

/**
 * @typedef {Array.<TBemPlainModifier|TBemKeyModifiers|TBemNormalizedModifiers>} TBemArrayModifiers
 */

/**
 * @typedef {TBemKeyModifiers|TBemArrayModifiers} TBemModifiers
 */

/**
 * @type {string}
 */
export const ERROR_MODIFIERS_VALIDATION =
	'Modifiers should be either an object or an array of objects, strings or numbers';

/**
 * @type {string}
 */
export const ERROR_DECORATOR_TARGET_VALIDATION = 'Decorator accepts only functions and classes';

/**
 * @type {string}
 */
export const ERROR_DECORATOR_BLOCKNAME_VALIDATION = 'Decorator parameter should be a string';

/**
 * Generates block className
 * @param {string} name
 * @param {TBemModifiers} [modifiers]
 * @returns {string}
 */
export function block(name: string, modifiers?: any): string {
	return modify(name, modifiers);
}

/**
 * Generates element className
 * @param {string} blockName
 * @param {string} name
 * @param {TBemModifiers} [modifiers]
 * @returns {string}
 */
export function element(blockName: string, name: string, modifiers?: any): string {
	return modify(`${blockName}--${name}`, modifiers);
}

/**
 * Generates modifier className
 * @param {string} name
 * @param {string} modifier
 * @returns {string}
 */
export function modifier(name: string, modifier: string | number) {
	return `${name}-${modifier}`;
}

/**
 * Combines selector with modifiers
 * @param {string} name
 * @param {TBemModifiers} [modifiers]
 * @private
 * @returns {string}
 */
function modify(name: string, modifiers?: any): string {
	const normalized = normalizeModifiers(modifiers);
	return [name].concat(normalized.map((m: any) => {
		return modifier(name, m);
	})).join(' ');
}

/**
 * Normalizes {@link TBemModifiers} to array of strings
 * @param {TBemModifiers} [modifiers]
 * @returns {TBemNormalizedModifiers}
 */
function normalizeModifiers(modifiers?: any): any {
	if (!modifiers) {
		return [];
	} else if (isArrayModifiers(modifiers)) {
		return normalizeArrayModifiers(modifiers);
	} else if (isKeyModifiers(modifiers)) {
		return normalizeKeyModifiers(modifiers);
	} else {
		throw new Error(ERROR_MODIFIERS_VALIDATION);
	}
}

/**
 * Normalzies {@Link TBemKeyModifiers} to array of strings
 * @param {TBemKeyModifiers} modifiers
 * @returns {TBemNormalizedModifiers}
 */
function normalizeKeyModifiers(modifiers: any): any {
	return Object.keys(modifiers).filter(key => !!modifiers[key]);
}

/**
 * Recursively normalizes {@link TBemArrayModifiers} to array of string
 * @param {TBemArrayModifiers} modifiers
 * @returns {TBemNormalizedModifiers}
 */
function normalizeArrayModifiers(modifiers: any): any {
	return modifiers.reduce((acc: any, modifier: any) => {
		if (isPlainModifier(modifier)) {
			return acc.concat(modifier);
		} else if (isKeyModifiers(modifier)) {
			return acc.concat(normalizeKeyModifiers(modifier));
		} else if (isArrayModifiers(modifier)) {
			return acc.concat(normalizeArrayModifiers(modifier));
		} else {
			throw new Error(ERROR_MODIFIERS_VALIDATION);
		}
	}, []);
}

/**
 * Checks if modifiers is an object with boolean values for classname keys
 * @param {TBemModifiers} modifiers
 * @returns {boolean}
 */
function isKeyModifiers(modifiers: any): boolean {
	return !isArrayModifiers(modifiers) && !!modifiers && typeof modifiers === 'object';
}

/**
 * Checks if modifiers is an array of plain strings or {@link TBemKeyModifiers}
 * @param {TBemModifiers} modifiers
 * @returns {boolean}
 */
function isArrayModifiers(modifiers: any): boolean {
	return Array.isArray(modifiers);
}

/**
 * Checks if modifier is a string
 * @param {TBemModifiers} modifier
 * @returns {boolean}
 */
function isPlainModifier(modifier: any): boolean {
	return typeof modifier === 'string' || typeof modifier === 'number';
}

/**
 * Universal helper for creating bem-based classNames
 * @param {string} blockName
 * @param {string|TBemModifiers} [elementOrBlockModifiers]
 * @param {TBemModifiers} [elementModifiers]
 * @returns {string}
 * @example
 * const block = bem('block'); //block
 * const blockModifiers = bem('block', ['first', {second: true}]); //block-first block-second
 * const blockModifiers2 = bem('block', {second: false}); //block
 * const blockElement = bem('block', 'element'); //block--element
 * const blockElementModifiers = bem('block', 'element', ['m']); //block--element-m
 */
export default function bem(blockName: string, elementOrBlockModifiers?: any, elementModifiers?: any): string {
	if (typeof elementOrBlockModifiers === 'string') {
		//block--element || block--element-modifiers
		return element(blockName, elementOrBlockModifiers, elementModifiers);
	} else if (isKeyModifiers(elementOrBlockModifiers) || isArrayModifiers(elementOrBlockModifiers)) {
		//block-modifiers
		return block(blockName, elementOrBlockModifiers);
	} else if (!elementOrBlockModifiers) {
		return blockName; //block
	}
	return '';
}

/**
 * Class decorator, injects 'bem' method which is bound to passed block name
 * @example
 * @BEM('foo')
 * class Foo extends React.Component {
 *  render() {
 *   return (
 *    <div className={this.bem()}> //foo
 *        <div className={this.bem('sub')}></div> //foo--sub
 *    </div>
 *   );
 *  }
 * }
 */
export function BEM(blockName: string) {
	if (typeof blockName !== 'string') {
		throw new Error(ERROR_DECORATOR_BLOCKNAME_VALIDATION);
	}

	return function (target: any) {
		if (typeof target !== 'function') {
			throw new Error(ERROR_DECORATOR_TARGET_VALIDATION);
		}

		target.prototype.bem = bem.bind(null, blockName);
		return target;
	};
}