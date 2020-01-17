import React from 'react';
import { PURE } from '../../utils/pure';
import { ButtonIcon, TButtonIconProps } from '../ButtonIcon/ButtonIcon';
import { Input as BaseInput, TInputProps } from '../input/Input';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { ComponentType } from 'react';

export const PASSWORD_INPUT = Symbol('PasswordInput') as symbol;

export type TFullPasswordInputProps = TInputProps & {
	theme: {
		container?: string;
		Input?: TInputProps['theme'];
		RevealButton?: TButtonIconProps['theme'];
	};
	Button?: React.ComponentClass<TButtonIconProps>;
	Input?: React.ComponentClass<TInputProps>;
	isDisabled?: boolean;
	IconShow: ComponentType<any>;
	IconHide: ComponentType<any>;
	isRevealed: boolean;
	onReveal: (isRevealed: boolean) => void;
};

@PURE
export class RawPasswordInput extends React.Component<TFullPasswordInputProps> {
	render() {
		const {
			theme,
			Button = ButtonIcon,
			Input = BaseInput,
			IconShow,
			IconHide,
			isDisabled,
			isRevealed,
			onReveal,
			...restInputProps
		} = this.props;

		const Icon = isRevealed ? IconShow : IconHide;
		return (
			<div className={theme.container}>
				<Input
					{...restInputProps}
					theme={theme.Input}
					isDisabled={isDisabled}
					type={isRevealed ? 'text' : 'password'}
				/>
				<Button
					icon={<Icon />}
					theme={theme.RevealButton}
					isDisabled={isDisabled}
					onClick={this.onClickRevealButton}
				/>
			</div>
		);
	}

	onClickRevealButton = () => {
		const { onReveal } = this.props;
		onReveal && onReveal(!this.props.isRevealed);
	};
}

export type TPasswordInputProps = PartialKeys<TFullPasswordInputProps, 'theme'>;
export const PasswordInput: React.ComponentClass<TPasswordInputProps> = withTheme(PASSWORD_INPUT)(RawPasswordInput);
