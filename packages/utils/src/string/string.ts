/**
 * Replaces underscores and camelCase with dashes.
 */
export function dasherize(string: string, lower: boolean = true): string {
	const dasherized = string.replace(/([a-z])(?=[A-Z])/g, '$1-');
	if (lower) {
		return dasherized.toLowerCase();
	} else {
		return dasherized;
	}
}

/**
 * Camelizes given string
 */
export function camelize(string: string, lower: boolean = true): string {
	//camelize
	const camelized = string.replace(/[-_\s]+(.)?/g, (match, c) => {
		return c ? c.toUpperCase() : '';
	});
	if (lower) {
		//decapitalize
		return decapitalize(camelized);
	} else {
		return capitalize(camelized);
	}
}

let uniqueIdCounter: number = 0;

/**
 * Generate a unique id
 */
export function randomId(prefix: string | number = '', postfix: string | number = ''): string {
	const id = ++uniqueIdCounter;
	return `${prefix}${id}${postfix}`;
}

/**
 * Capitalizes given string
 */
export function capitalize(string: string): string {
	return string.slice(0, 1).toUpperCase() + string.slice(1);
}

/**
 * Decapitalizes given string
 */
export function decapitalize(string: string): string {
	return string.slice(0, 1).toLowerCase() + string.slice(1);
}

/**
 * Chooses correct value for passed number (1, 2-4, 0 or many) for three base declensions (RUS)
 */
export function pluralize3(number: number, declensions: string[]): string {
	const cases = [2, 0, 1, 1, 1, 2];
	const floored = Math.floor(Math.abs(number));
	if (floored % 100 > 4 && floored % 100 < 20) {
		return declensions[2];
	} else if (floored % 10 < 5) {
		return declensions[cases[floored % 10]];
	} else {
		return declensions[cases[5]];
	}
}

/**
 * Chooses correct value for passed number (1, 0 or many) for two base declensions (EN, etc.)
 * @param {Number} number
 * @param {Array.<String>} declensions
 * @returns {String}
 */
export function pluralize2(number: number, declensions: string[]): string {
	const floored = Math.floor(Math.abs(number));

	if (floored % 10 === 1 && floored !== 11) {
		return declensions[0];
	} else {
		return declensions[1];
	}
}

/**
 * Generates universal unique id
 * @see https://gist.github.com/gordonbrander/2230317#gistcomment-1618310
 */
export function uuid(): string {
	const chr4 = () => Math.random().toString(16).slice(-4);
	return `${chr4() + chr4()}-${chr4()}-${chr4()}-${chr4()}-${chr4() + chr4() + chr4()}`;
}