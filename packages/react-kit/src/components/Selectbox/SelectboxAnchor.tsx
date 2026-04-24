import React, { RefObject } from 'react';
import { PURE } from '../../utils/pure';
import { Button, TButtonProps, TFullButtonProps } from '../Button/Button';
import { ReactNode, ReactText } from 'react';
import { Omit } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/platform-utils/dist/object/object';
import classnames from 'classnames';

export type TFullSelectboxAnchorProps = Omit<TButtonProps, 'theme'> & {
	theme?: TFullButtonProps['theme'] & {
		text?: string;
		content?: string;
		wrapperCaret?: string;
		caret?: string;
		container_isOpened?: string;
	};
	isOpened?: boolean;
	caretIcon?: ReactNode;
	value?: ReactText | ReactText[];
	valueText?: ReactNode;
	innerRef?: RefObject<HTMLButtonElement>;
	children?: ReactNode;
};

@PURE
export class SelectboxAnchor extends React.Component<TFullSelectboxAnchorProps> {
	render() {
		const {
			theme,
			children,
			valueText,
			isDisabled,
			isPrimary,
			isLoading,
			caretIcon,
			onClick,
			isOpened,
			innerRef,
			...buttonProps
		} = this.props;

		const buttonTheme = {
			container: classnames(theme?.container, {
				[theme?.container_isOpened as string]: isOpened,
			}),
		};

		return (
			<Button
				isDisabled={isDisabled}
				isLoading={isLoading}
				isPrimary={isPrimary}
				theme={buttonTheme}
				innerRef={innerRef}
				onClick={onClick}
				{...buttonProps}>
				<div className={theme?.content}>
					<div className={theme?.text}>{valueText}</div>
					<div className={theme?.caret}>{caretIcon}</div>
				</div>
				{children}
			</Button>
		);
	}
}

export type TSelectboxAnchorProps = PartialKeys<TFullSelectboxAnchorProps, 'theme'>;
