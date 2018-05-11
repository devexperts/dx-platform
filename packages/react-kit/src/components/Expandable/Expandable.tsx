import * as React from 'react';
import * as classnames from 'classnames';
import { ExpandableHandler, TExpandableHandlerProps } from './ExpandableHandler';
import { PURE } from '../../utils/pure';
import { ComponentClass } from 'react';
import { withTheme } from '../../utils/withTheme';
import { ObjectClean } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { TControlProps } from '../Control/Control';

export const EXPANDABLE = Symbol('Expandable');

type TFullExpandableProps = TControlProps<boolean | null> & {
	theme: {
		container?: string,
		handler?: string,
		container_isExpanded?: string,
		Handler?: TExpandableHandlerProps['theme'],
		content?: string,
	},
	Handler: any
}

@PURE
class RawExpandable extends React.Component<TFullExpandableProps> {

	static defaultProps = {
		Handler: ExpandableHandler
	}

	render() {
		const {theme, Handler, value, children} = this.props;

		const className = classnames(theme.container, {
			[theme.container_isExpanded as string]: value
		});

		return (
			<div className={className}>
				<div className={theme.handler} onClick={this.onHandlerClick}>
					<Handler isExpanded={value} theme={theme.Handler} />
				</div>
				<div className={theme.content}>
					{children}
				</div>
			</div>
		);
	}

	onHandlerClick = () => {
		const {onValueChange, value} = this.props;
		onValueChange && onValueChange(!value);
	}
}

export type TExpandableProps = ObjectClean<PartialKeys<TFullExpandableProps, 'theme' | 'Handler' >>;
export const Expandable: ComponentClass<TExpandableProps> = withTheme(EXPANDABLE)(RawExpandable);