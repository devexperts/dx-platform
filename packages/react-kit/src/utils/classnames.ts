import classnames from 'classnames';

type ClassValue = Parameters<typeof classnames>[0];

export const objectToClassnames = (source: ClassValue, aggregator = new Array<string>()): string | undefined => {
	if (typeof source !== 'object') {
		return undefined;
	}

	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			if (typeof source[key] === 'string') {
				aggregator.push(key);
			}

			return objectToClassnames(source[key], aggregator);
		}
	}

	return aggregator.join(' ');
};
