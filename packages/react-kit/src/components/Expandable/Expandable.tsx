import React from 'react';
import classnames from 'classnames';
import { ExpandableHandler, TExpandableHandlerProps } from './ExpandableHandler';
import { PURE } from '../../utils/pure';
import { ComponentClass } from 'react';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { TControlProps } from '../Control/Control';
import { withDefaults } from '../../utils/with-defaults';

export const EXPANDABLE = Symbol('Expandable') as symbol;

export type TFullExpandableProps = TControlProps<boolean | undefined | null> & {
	theme: {
		container?: string;
		handler?: string;
		container_isExpanded?: string;
		Handler?: TExpandableHandlerProps['theme'];
		content?: string;
	};
	Handler: any;
};

@PURE
class RawExpandable extends React.Component<TFullExpandableProps> {
	render() {
		const { theme, Handler, value, children } = this.props;

		const className = classnames(theme.container, {
			[theme.container_isExpanded as string]: value,
		});

		return (
			<div className={className}>
				<div className={theme.handler} onClick={this.onHandlerClick}>
					<Handler isExpanded={value} theme={theme.Handler} />
				</div>
				<div className={theme.content}>{children}</div>
			</div>
		);
	}

	onHandlerClick = () => {
		const { onValueChange, value } = this.props;
		onValueChange && onValueChange(!value);
	};
}

export type TExpandableProps = PartialKeys<TFullExpandableProps, 'theme' | 'Handler'>;
export const Expandable: ComponentClass<TExpandableProps> = withTheme(EXPANDABLE)(
	withDefaults<TFullExpandableProps, 'Handler'>({
		Handler: ExpandableHandler,
	})(RawExpandable),
);
