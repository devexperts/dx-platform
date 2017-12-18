import * as React from 'react';
import split from '@devexperts/utils/lib/string/split';
import { PURE } from '../../utils/pure';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/lib/object/object';
import { ObjectClean } from 'typelevel-ts/lib';
import { ComponentClass, ReactNode } from 'react';

export const HIGHLIGHT = Symbol('Mark');

export type TFullHighlightProps = {
	search: string,
	children: string,
	theme: {
		mark?: string,
		container?: string
	}
};

@PURE
class RawHighlight extends React.Component<TFullHighlightProps> {
	static defaultProps = {
		children: '',
		search: ''
	};

	render() {
		const { search, children, theme } = this.props;

		let result;
		if (this.props.search === '') {
			result = children;
		} else {
			const splitted = split(children, search, false);
			result = splitted.reduce<ReactNode[]>((acc, el, i) => {
				if (el.trim() !== '') {
					acc.push(i % 2 ? <mark className={theme.mark} key={i}>{el}</mark> : el);
				}
				return acc;
			}, []);
		}

		return (
			<span className={theme.container}>
				{result}
			</span>
		);
	}
}

export type THighlightProps = ObjectClean<PartialKeys<TFullHighlightProps, 'theme' | 'search' | 'children'>>;
export const Highlight: ComponentClass<THighlightProps> = withTheme(HIGHLIGHT)(RawHighlight);