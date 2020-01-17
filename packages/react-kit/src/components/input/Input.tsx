import React from 'react';
import ReactDOM from 'react-dom';
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
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { withTheme } from '../../utils/withTheme';
import { ReactRef } from '../../utils/typings';

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
	error?: React.ReactNode; //for possible Input Class extensions
	innerRef?: (instance: ReactRef) => void;

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
class RawInput extends React.Component<TFullInputProps, TInputState> {
	static defaultProps = {
		tabIndex: 0,
	};

	state = {
		isFocused: false,
	};

	private input!: React.ReactInstance | null;
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
		} = this.props;

		const { isFocused } = this.state;

		const className = classnames(theme.container, {
			[theme.container_isFocused as string]: !isDisabled && isFocused,
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
				onFocus={this.onFocus}
				onBlur={this.onBlur}
				onWheel={onWheel}
				tabIndex={!isCustom && (isFocused || isDisabled) ? -1 : tabIndex}
				ref={this.getRef}
				{...(isCustom && keyboardEvents)}>
				<input
					className={theme.input}
					ref={el => (this.input = el)}
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
				/>
				{children}
			</div>
		);
	}

	private getRef = (input: ReactRef<HTMLElement>): void => {
		const { innerRef } = this.props;

		if (innerRef) {
			innerRef(input);
		}
	};

	onFocus = (e: React.FocusEvent<HTMLElement>) => {
		if (!this.props.isDisabled && !this.state.isFocused && !this.isFocusingOnInput && this.input) {
			const input = ReactDOM.findDOMNode(this.input) as HTMLElement;
			if (input) {
				this.isFocusingOnInput = true;
				input.focus();
				this.isFocusingOnInput = false;
			}
			this.setState({
				isFocused: true,
			});
			this.props.onFocus && this.props.onFocus(e);
		}
	};

	onBlur = (e: React.FocusEvent<HTMLElement>) => {
		if (!this.props.isDisabled && this.state.isFocused && !this.isFocusingOnInput) {
			this.setState({
				isFocused: false,
			});
			this.props.onBlur && this.props.onBlur(e);
		}
	};

	onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onValueChange && this.props.onValueChange(e.target.value);
		this.props.onChange && this.props.onChange(e);
	};
}

export type TInputProps = PartialKeys<TFullInputProps, 'theme'>;
export const Input: ComponentClass<TInputProps> = withTheme(INPUT)(RawInput);
