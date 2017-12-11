import * as React from 'react';
import { PURE } from '@devexperts/utils/lib/react/pure';
import { Button, TButtonProps, TFullButtonProps } from '../Button/Button';
import { ComponentClass, ComponentType, ReactNode } from 'react';
import { ObjectClean, ObjectOmit } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/lib/object/object';

export type TFullSelectboxAnchorProps = ObjectOmit<TButtonProps, 'theme'> & {
	theme: TFullButtonProps['theme'] & {
		text?: string,
		content?: string,
		wrapperCaret?: string,
		caret?: string
	},
	isOpened?: boolean,
	caretIcon?: React.ReactElement<any> | React.ReactText,
	value?: string | number,
	valueText?: ReactNode
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
		} = this.props;

		const buttonTheme = {
			container: theme.container
		};

		return (
			<Button onClick={onClick}
			        isDisabled={isDisabled}
			        isLoading={isLoading}
			        isPrimary={isPrimary}
			        theme={buttonTheme}>
				<div className={theme.content}>
					<div className={theme.text}>
						{valueText}
					</div>
					<div className={theme.caret}>
                        {caretIcon}
					</div>
				</div>
				{children}
			</Button>
		);
	}
}

export type TSelectboxAnchorProps = ObjectClean<PartialKeys<TFullSelectboxAnchorProps, 'theme'>>;
export const SelectboxAnchor: ComponentClass<TSelectboxAnchorProps> = RawSelectboxAnchor;