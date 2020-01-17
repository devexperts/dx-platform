import React from 'react';
import split from '@devexperts/utils/dist/string/split';
import { PURE } from '../../utils/pure';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { ComponentClass, ReactNode } from 'react';
import { withDefaults } from '../../utils/with-defaults';

export const HIGHLIGHT = Symbol('Mark') as symbol;

export type TFullHighlightProps = {
	search: string;
	children: string;
	theme: {
		mark?: string;
		container?: string;
	};
};

@PURE
class RawHighlight extends React.Component<TFullHighlightProps> {
	render() {
		const { search, children, theme } = this.props;

		let result;
		if (this.props.search === '') {
			result = children;
		} else {
			const splitted = split(children, search, false);
			result = splitted.reduce<ReactNode[]>((acc, el, i) => {
				if (el.trim() !== '') {
					acc.push(
						i % 2 ? (
							<mark className={theme.mark} key={i}>
								{el}
							</mark>
						) : (
							el
						),
					);
				}
				return acc;
			}, []);
		}

		return <span className={theme.container}>{result}</span>;
	}
}

export type THighlightProps = PartialKeys<TFullHighlightProps, 'theme' | 'search'>;
export const Highlight: ComponentClass<THighlightProps> = withTheme(HIGHLIGHT)(
	withDefaults<TFullHighlightProps, 'search'>({
		search: '',
	})(RawHighlight),
);
