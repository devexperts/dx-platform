import { capitalize } from '../string/string';

/**
 * Get bounding client rect of given element
 */
export function getBoundingClientRect(element: HTMLElement): ClientRect & { middle: number, center: number } {
	const rect = element.getBoundingClientRect();
	const { top, left, right, bottom } = rect;
	let { width, height } = rect;

	width = width || element.offsetWidth;
	height = height || element.offsetHeight;

	return {
		top,
		right: Math.round(right),
		bottom: Math.round(bottom),
		left: Math.round(left),
		width,
		height,
		middle: left + width / 2,
		center: top + height / 2
	};
}

/**
 * Set all styles from provided object to the element
 */
export function style(el: HTMLElement, styles: object) {
	if (el && isPlainObject(styles)) {
		Object.keys(styles).forEach((rule: string) => {
			el.style[rule] = styles[rule];
		});
	}
}

/**
 * Get vendors property
 */
export function getVendorProperty(property: string): string[] {
	const capitalizedProp = capitalize(property);
	return ['WebKit', 'Moz', 'ms', 'O'].map(prefix => {
		return `${prefix}${capitalizedProp}`;
	});
}

/**
 * Assign style property to element with all possible vendor prefixes.
 */
export function setVendorStyle(element: HTMLElement, property: string, value: any) {
	element.style[property] = value;
	getVendorProperty(property).forEach(vendorProperty => {
		element.style[vendorProperty] = value;
	});
}

/**
 * Checks that pass a variable object
 */
function isPlainObject(object: object): boolean {
	return object && typeof object === 'object' && !Array.isArray(object);
}

/**
 * Checkes if DOM can be access in current environment
 */
export function canUseDOM(): boolean {
	return Boolean(typeof window !== 'undefined' && window.document && window.document.createElement);
}

/**
 * Checks if context contains node in the DOM tree
 * @see https://github.com/react-bootstrap/dom-helpers/blob/master/src/query/contains.js
 */
export const contains: (context: Node, node: Node) => boolean =
	!canUseDOM() ? fallback : (context, node) => {
		if (context.contains) {
			return context.contains(node);
		} else if (context.compareDocumentPosition) {
			return context === node || !!(context.compareDocumentPosition(node) & 16); //tslint:disable-line no-bitwise
		} else {
			return fallback(context, node);
		}
	};

/**
 * @see  https://github.com/react-bootstrap/dom-helpers/blob/master/src/query/contains.js
 */
function fallback(context: Node, node: Node): boolean {
	if (node) {
		let current: Node | null = node;
		do {
			if (current === context) {
				return true;
			}
		} while ((current = current.parentNode)); //tslint:disable-line no-conditional-assignment
	}

	return false;
}
