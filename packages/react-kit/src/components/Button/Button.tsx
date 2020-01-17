import React from 'react';
import classnames from 'classnames';
import { PURE } from '../../utils/pure';
import { LoadingIndicator, TLoadingIndicatorProps } from '../LoadingIndicator/LoadingIndicator';
import { withTheme } from '../../utils/withTheme';
import { ComponentClass, EventHandler, MouseEvent, TouchEvent } from 'react';
import { PartialKeys } from '@devexperts/utils/dist/object/object';

export const BUTTON = Symbol('Button') as symbol;

export type TFullButtonProps = {
	theme: {
		container?: string;
		container_primary?: string;
		container_flat?: string;
		container_isLoading?: string;
		loadingIndicator?: string;
		LoadingIndicator?: TLoadingIndicatorProps['theme'];
	};
	isDisabled?: boolean;
	isFlat?: boolean;
	isLoading?: boolean;
	isPrimary?: boolean;
	style?: {};
	type?: 'submit' | 'reset' | 'button';
	onMouseLeave?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onMouseDown?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onMouseUp?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onMouseEnter?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onMouseMove?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onMouseOut?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onMouseOver?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onDoubleClick?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onDrag?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onDragEnd?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onDragEnter?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onDragExit?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onDragLeave?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onDragOver?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onDragStart?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onDrop?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onClick?: EventHandler<MouseEvent<HTMLButtonElement>>;
	onTouchCancel?: EventHandler<TouchEvent<HTMLButtonElement>>;
	onTouchEnd?: EventHandler<TouchEvent<HTMLButtonElement>>;
	onTouchMove?: EventHandler<TouchEvent<HTMLButtonElement>>;
	onTouchStart?: EventHandler<TouchEvent<HTMLButtonElement>>;
	tabIndex?: number;
};

@PURE
class RawButton extends React.Component<TFullButtonProps> {
	static defaultProps: Partial<TFullButtonProps> = {
		type: 'button',
	};

	render() {
		const {
			theme,
			style,
			type,
			children,
			onMouseLeave,
			onMouseDown,
			onMouseUp,
			onMouseEnter,
			onMouseMove,
			onMouseOut,
			onMouseOver,
			onDoubleClick,
			onDrag,
			onDragEnd,
			onDragEnter,
			onDragExit,
			onDragLeave,
			onDragOver,
			onDragStart,
			onDrop,
			onClick,
			onTouchCancel,
			onTouchEnd,
			onTouchMove,
			onTouchStart,
			isFlat,
			isPrimary,
			isLoading,
			isDisabled,
			tabIndex,
		} = this.props;

		const className = classnames(theme.container, {
			[theme.container_primary as string]: isPrimary,
			[theme.container_flat as string]: isFlat,
			[theme.container_isLoading as string]: isLoading,
		});

		return (
			<button
				className={className}
				onMouseLeave={onMouseLeave}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onMouseEnter={onMouseEnter}
				onMouseMove={onMouseMove}
				onMouseOut={onMouseOut}
				onMouseOver={onMouseOver}
				onDoubleClick={onDoubleClick}
				onDrag={onDrag}
				onDragEnd={onDragEnd}
				onDragEnter={onDragEnter}
				onDragExit={onDragExit}
				onDragLeave={onDragLeave}
				onDragOver={onDragOver}
				onDragStart={onDragStart}
				onDrop={onDrop}
				onClick={onClick}
				onTouchCancel={onTouchCancel}
				onTouchEnd={onTouchEnd}
				onTouchMove={onTouchMove}
				onTouchStart={onTouchStart}
				type={type}
				style={style}
				tabIndex={tabIndex}
				disabled={isDisabled}>
				{children}
				{isLoading && (
					<div className={theme.loadingIndicator}>
						<LoadingIndicator theme={theme.LoadingIndicator} />
					</div>
				)}
			</button>
		);
	}
}

export type TButtonProps = PartialKeys<TFullButtonProps, 'theme'>;
export const Button: ComponentClass<TButtonProps> = withTheme(BUTTON)(RawButton);
