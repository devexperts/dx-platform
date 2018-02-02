import * as React from 'react';
import { Button as BasicButton, TButtonProps } from '../Button/Button';
import { PURE } from '../../utils/pure';
import { ComponentClass, ComponentType } from 'react';
import { withTheme } from '../../utils/withTheme';
import { ObjectClean } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/lib/object/object';

export const BUTTON_ICON = Symbol('ButtonIcon');

export type TFullButtonIconProps = ObjectClean<TButtonProps & {
	Button: ComponentType<TButtonProps>,
	icon: React.ReactNode,
	theme: {
		icon?: string
	} & TButtonProps['theme']
}>;

@PURE
class RawButtonIcon extends React.Component<TFullButtonIconProps> {

	render() {
		const { theme, Button = BasicButton, children, icon, ...props } = this.props;

		return (
			<Button {...props} theme={theme}>
				<span className={theme.icon}>
					{icon}
				</span>
				{children}
			</Button>
		);
	}
}

export type TButtonIconProps = ObjectClean<PartialKeys<TFullButtonIconProps, 'Button' | 'theme'>>;
export const ButtonIcon: ComponentClass<TButtonIconProps> = withTheme(BUTTON_ICON)(RawButtonIcon);