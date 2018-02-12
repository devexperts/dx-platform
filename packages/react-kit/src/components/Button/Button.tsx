import * as React from 'react';
import * as classnames from 'classnames';
import { PURE } from '../../utils/pure';
import { LoadingIndicator, TLoadingIndicatorProps } from '../LoadingIndicator/LoadingIndicator';
import { withTheme } from '../../utils/withTheme';
import { ComponentClass, EventHandler, MouseEvent } from 'react';
import { PartialKeys } from '@devexperts/utils/lib/object/object';
import { ObjectClean } from 'typelevel-ts';

export const BUTTON = Symbol('Button');

export type TFullButtonProps = {
	theme: {
		container?: string,
		container_primary?: string,
		container_flat?: string,
		container_isLoading?: string,
		loadingIndicator?: string,
		LoadingIndicator?: TLoadingIndicatorProps['theme']
	},
	isDisabled?: boolean,
	isFlat?: boolean,
	style?: {},
	type?: string,
	isLoading?: boolean,
	isPrimary?: boolean,
	onMouseLeave?: EventHandler<MouseEvent<HTMLButtonElement>>,
	onMouseDown?: EventHandler<MouseEvent<HTMLButtonElement>>,
	onMouseUp?: EventHandler<MouseEvent<HTMLButtonElement>>,
	onClick?: EventHandler<MouseEvent<HTMLButtonElement>>,
	tabIndex?: number

};


@PURE
class RawButton extends React.Component<TFullButtonProps> {
	static defaultProps = {
		type: 'button'
	};

	render() {
		const {
			theme,
			style,
			type,
			children,
			onClick,
			onMouseDown,
			onMouseLeave,
			onMouseUp,
			isFlat,
			isPrimary,
			isLoading,
			isDisabled,
			tabIndex
		} = this.props;

		const className = classnames(theme.container, {
			[theme.container_primary as string]: isPrimary,
			[theme.container_flat as string]: isFlat,
			[theme.container_isLoading as string]: isLoading
		});

		return (
			<button className={className}
			        onClick={onClick}
			        onMouseLeave={onMouseLeave}
			        onMouseDown={onMouseDown}
			        onMouseUp={onMouseUp}
			        type={type}
			        style={style}
			        tabIndex={tabIndex}
			        disabled={isDisabled}>
				{children}
				{isLoading && (
					<div className={theme.loadingIndicator}>
						<LoadingIndicator theme={theme.LoadingIndicator}/>
					</div>
				)}
			</button>
		);
	}
}

export type TButtonProps = ObjectClean<PartialKeys<TFullButtonProps, 'theme'>>;
export const Button: ComponentClass<TButtonProps> = withTheme(BUTTON)(RawButton);