import React from 'react';
import { Button, TButtonProps } from '../Button/Button';
import { PURE } from '../../utils/pure';
import { ComponentClass, ComponentType } from 'react';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { withDefaults } from '../../utils/with-defaults';

export const BUTTON_ICON = Symbol('ButtonIcon') as symbol;

export type TFullButtonIconProps = TButtonProps & {
	Button: ComponentType<TButtonProps>;
	icon: React.ReactNode;
	theme: {
		icon?: string;
	} & TButtonProps['theme'];
};

@PURE
class RawButtonIcon extends React.Component<TFullButtonIconProps> {
	render() {
		const { theme, Button, children, icon, ...props } = this.props;

		return (
			<Button {...props} theme={theme}>
				<span className={theme.icon}>{icon}</span>
				{children}
			</Button>
		);
	}
}

export type TButtonIconProps = PartialKeys<TFullButtonIconProps, 'Button' | 'theme'>;
export const ButtonIcon: ComponentClass<TButtonIconProps> = withTheme(BUTTON_ICON)(
	withDefaults<TFullButtonIconProps, 'Button'>({
		Button,
	})(RawButtonIcon),
);
