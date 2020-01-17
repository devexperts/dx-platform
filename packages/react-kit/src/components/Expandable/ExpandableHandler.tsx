import React from 'react';
import { PURE } from '../../utils/pure';
import { ComponentClass, ReactElement } from 'react';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';

export const EXPANDABLE_HEADER = Symbol() as symbol;

export type TFullExpandableHandlerProps = {
	isExpanded?: boolean;
	theme: {
		container?: string;
	};
	children: ReactElement<any>;
};

@PURE
class RawExpandableHandler extends React.Component<TFullExpandableHandlerProps> {
	render() {
		const { theme, children } = this.props;
		return <div className={theme.container}>{children}</div>;
	}
}

export type TExpandableHandlerProps = PartialKeys<TFullExpandableHandlerProps, 'theme' | 'isExpanded'>;
export const ExpandableHandler: ComponentClass<TExpandableHandlerProps> = withTheme(EXPANDABLE_HEADER)(
	RawExpandableHandler,
);
