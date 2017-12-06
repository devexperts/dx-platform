/**
 * Splits sources string by given substring
 */
export function split(string: string, substring: string, caseSensitive: boolean = true): string[] {
	if (!substring && substring !== '0') {
		return [string];
	}

	const flags = `${caseSensitive ? '' : 'i'}gm`;
	const pattern = substring.replace(/([\[()*+?.\\^$|])/g, '\\$1');
	const regexp = new RegExp(`(${pattern})`, flags);

	return string.split(regexp);
}

export default split;