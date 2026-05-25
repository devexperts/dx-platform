import React, { createRef, FocusEvent, Component, ChangeEvent, ReactNode, Ref } from 'react';
import classnames from 'classnames';
import { PURE } from '../../utils/pure';
import { TControlProps } from '../Control/Control';
import {
	ChangeEventHandler,
	ComponentClass,
	FocusEventHandler,
	KeyboardEventHandler,
	MouseEventHandler,
	WheelEventHandler,
} from 'react';
import { PartialKeys } from '@devexperts/platform-utils/dist/object/object';
import { withTheme } from '../../utils/withTheme';

export const INPUT = Symbol('Input') as symbol;

export type TFullInputProps = TControlProps<string | undefined> & {
	min?: any;
	max?: any;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	tabIndex?: number;
	type?: string;
	placeholder?: string;
	pattern?: string;
	name?: string;
	id?: string;
	error?: ReactNode; //for possible Input Class extensions
	isFocused?: boolean;
	innerRef?: Ref<HTMLDivElement>;

	onChange?: ChangeEventHandler<HTMLInputElement>;
	onFocus?: FocusEventHandler<HTMLElement>;
	onBlur?: FocusEventHandler<HTMLElement>;
	onClick?: MouseEventHandler<HTMLElement>;
	onMouseDown?: MouseEventHandler<HTMLElement>;
	onMouseUp?: MouseEventHandler<HTMLElement>;
	onMouseEnter?: MouseEventHandler<HTMLElement>;
	onMouseLeave?: MouseEventHandler<HTMLElement>;
	onKeyPress?: KeyboardEventHandler<HTMLElement | HTMLInputElement>;
	onKeyDown?: KeyboardEventHandler<HTMLElement | HTMLInputElement>;
	onKeyUp?: KeyboardEventHandler<HTMLElement | HTMLInputElement>;

	onWheel?: WheelEventHandler<HTMLElement>;

	theme: {
		container?: string;
		container_isFocused?: string;
		container_hasError?: string;
		container_isDisabled?: string;
		container_isReadOnly?: string;
		input?: string;
	};
};

type TInputState = {
	isFocused: boolean;
};

@PURE
class RawInput extends Component<TFullInputProps, TInputState> {
	static defaultProps = {
		tabIndex: 0,
	};

	state = {
		isFocused: false,
	};

	private input = createRef<HTMLInputElement>();
	private isFocusingOnInput!: boolean;

	render() {
		const {
			theme,
			isDisabled,
			isReadOnly,
			tabIndex,
			children,
			value,
			error,
			onClick,
			onMouseDown,
			onMouseUp,
			onMouseEnter,
			onMouseLeave,
			onKeyDown,
			onKeyUp,
			onKeyPress,
			min,
			placeholder,
			max,
			type,
			name,
			pattern,
			id,
			onWheel,
			isFocused,
			onValueChange,
			innerRef,
			...inputProps
		} = this.props;

		const isFocusedDefined = isFocused !== undefined;

		const isFocusedInput = isFocusedDefined ? isFocused : this.state.isFocused;
		const onFocusHandler = isFocusedDefined ? this.props.onFocus : this.onFocus;
		const onBlurHandler = isFocusedDefined ? this.props.onBlur : this.onBlur;

		const className = classnames(theme.container, {
			[theme.container_isFocused as string]: !isDisabled && isFocusedInput,
			[theme.container_isDisabled as string]: isDisabled,
			[theme.container_isReadOnly as string]: isReadOnly,
			[theme.container_hasError as string]: Boolean(error),
		});

		const isCustom = type === 'hidden';
		const keyboardEvents = {
			onKeyDown,
			onKeyUp,
			onKeyPress,
		};

		return (
			<div
				className={className}
				id={id}
				onClick={e => !isDisabled && onClick && onClick(e)}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onFocus={onFocusHandler}
				onBlur={onBlurHandler}
				onWheel={onWheel}
				tabIndex={!isCustom && (isFocusedInput || isDisabled) ? -1 : tabIndex}
				ref={innerRef}
				{...(isCustom && keyboardEvents)}>
				<input
					className={theme.input}
					ref={this.input}
					value={value}
					type={type}
					min={min}
					max={max}
					pattern={pattern}
					name={name}
					onChange={this.onChange}
					placeholder={placeholder}
					tabIndex={-1}
					readOnly={isReadOnly}
					disabled={isDisabled}
					{...(!isCustom && keyboardEvents)}
					{...inputProps}
				/>
				{children}
			</div>
		);
	}

	private onFocus = (e: FocusEvent<HTMLElement>) => {
		if (!this.props.isDisabled && !this.isFocusingOnInput && this.input) {
			const input = this.input.current;
			if (input) {
				this.isFocusingOnInput = true;
				input.focus();
				this.isFocusingOnInput = false;
			}
			this.setState({
				isFocused: true,
			});
			this.props.onFocus?.(e);
		}
	};

	private onBlur = (e: FocusEvent<HTMLElement>) => {
		if (!this.props.isDisabled && !this.isFocusingOnInput) {
			this.setState({
				isFocused: false,
			});
			this.props.onBlur?.(e);
		}
	};

	private onChange = (e: ChangeEvent<HTMLInputElement>) => {
		this.props.onValueChange && this.props.onValueChange(e.target.value);
		this.props.onChange?.(e);
	};
}

export type TInputProps = PartialKeys<TFullInputProps, 'theme'>;
export const Input: ComponentClass<TInputProps> = withTheme(INPUT)(RawInput);
