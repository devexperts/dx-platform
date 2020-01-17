import React from 'react';
import { PURE } from '../../utils/pure';
import { Button, TButtonProps, TFullButtonProps } from '../Button/Button';
import { ComponentClass, ReactNode, ReactText } from 'react';
import { Omit } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import classnames from 'classnames';

export type TFullSelectboxAnchorProps = Omit<TButtonProps, 'theme'> & {
	theme: TFullButtonProps['theme'] & {
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
};

@PURE
class RawSelectboxAnchor extends React.Component<TFullSelectboxAnchorProps> {
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
		} = this.props;

		const buttonTheme = {
			container: classnames(theme.container, {
				[theme.container_isOpened as string]: isOpened,
			}),
		};

		return (
			<Button
				onClick={onClick}
				isDisabled={isDisabled}
				isLoading={isLoading}
				isPrimary={isPrimary}
				theme={buttonTheme}>
				<div className={theme.content}>
					<div className={theme.text}>{valueText}</div>
					<div className={theme.caret}>{caretIcon}</div>
				</div>
				{children}
			</Button>
		);
	}
}

export type TSelectboxAnchorProps = PartialKeys<TFullSelectboxAnchorProps, 'theme'>;
export const SelectboxAnchor: ComponentClass<TSelectboxAnchorProps> = RawSelectboxAnchor as any;
