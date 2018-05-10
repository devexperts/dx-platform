import * as React from 'react';
import { SteppableInput, TSteppableInputProps } from '../SteppableInput/SteppableInput';
import { KeyCode, TControlProps } from '../Control/Control';
import { withTheme } from '../../utils/withTheme';
import { ObjectClean } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { ComponentClass } from 'react';
import { Input, TInputProps } from '../input/Input';

export const NUMERIC_STEPPER = Symbol('NumericStepper');

export type TNumericStepperOwnProps = TSteppableInputProps & TControlProps<any> & {
	step: number,
	min: number,
	max: number,
	parser?: any,
	formatter?: any,
	manualEdit: boolean
};

export type TNumericStepperFullProps = TNumericStepperOwnProps & {
	SteppableInput: React.ComponentClass<TSteppableInputProps> | React.SFC<TSteppableInputProps>,
	theme: {
		inner?: string,
		inner_isFilled?: string,
		section?: string,
		section_isActive?: string,
		separator?: string,
		SteppableInput?: TSteppableInputProps['theme'],
		Input?: TInputProps['theme'],
	}
};

type TNumericStepperState = {
	isFocused: boolean,
	displayedValue: any
}

class RawNumericStepper extends React.Component<TNumericStepperFullProps, TNumericStepperState> {
	static defaultProps = {
		step: 1,
		manualEdit: true,
		min: Number.NEGATIVE_INFINITY,
		max: Number.POSITIVE_INFINITY,
		SteppableInput
	}

	constructor(props: TNumericStepperFullProps) {
		super(props);

		const state: TNumericStepperState = {
			isFocused: false,
			displayedValue: props.value
		}

		if (props.value) {
			state.displayedValue = this.formatValue(props.value)
		}

		this.state = state;
	}

	componentWillReceiveProps(newProps: TNumericStepperFullProps) {
		this.setState({
			displayedValue: this.formatValue(newProps.value)
		});
	}

	render() {
		const { displayedValue: value } = this.state;

		const {
			theme,
			decrementIcon,
			incrementIcon,
			isDisabled,
			clearIcon,
			error,
			SteppableInput
		} = this.props;

		return (
			<SteppableInput isDisabled={isDisabled}
							error={error}
							theme={theme.SteppableInput}
							onDecrement={this.onDecrement}
							onIncrement={this.onIncrement}
							decrementIcon={decrementIcon}
							incrementIcon={incrementIcon}
							clearIcon={clearIcon}>
				<Input type="text" onKeyDown={this.onKeyDown} onFocus={this.onFocus} onWheel={this.onWheel}
				       theme={theme.Input} isDisabled={isDisabled} value={`${value}`} onBlur={this.onBlur}
				       onValueChange={() => console.log('test')}/>
			</SteppableInput>
		);
	}

	private onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		switch (event.keyCode) {
			case KeyCode.Up:
				this.increase();
				break;
			case KeyCode.Down:
				this.decrease();
				break;
		}
	}

	private getPrecision(step: number): number {
		if (Number.isInteger(step)) {
			return 0;
		} else {
			return step.toString(10).split('.')[1].length;
		}
	}

	private step(n: number) {
		const { step, min, max, onValueChange } = this.props;
		const value = this.props.value as number;
		const num = value + n * step;
		const precision = this.getPrecision(step);

		const frac = Math.pow(10, precision);
		const newValue = Math.round(num * frac) / frac;

		if (newValue >= min && newValue <= max && newValue !== value) {
			onValueChange && onValueChange(newValue);
		}
	}

	private onFocus = () => {
		this.setState({
			isFocused: true
		});
	}

	private formatValue(value: number | string): string {
		const { formatter } = this.props;
		return formatter ? formatter(value) : value;
	}

	/**
	 * Trying to parse the entered string to a number.
	 * Done here because `onChange` should return a valid numeric value if possible,
	 * e.g. for proper interop with `stateful`.
	 */
	private parseValue(value: string): string | number {
		const { parser } = this.props;

		if (parser) {
			return parser(value);
		} else {
			const num = Number(value);
			return isNaN(num) ? value : num;
		}
	}

	private onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		const {manualEdit, onValueChange} = this.props;
		if (!manualEdit) {
			return;
		}

		const { value } = event.target;
		const newValue = this.parseValue(value as string);

		this.setState({
			isFocused: false,
			displayedValue: this.formatValue(newValue)
		});

		onValueChange && onValueChange(newValue);
	}

	private onWheel = (event: React.WheelEvent<HTMLElement>) => {
		const { isDisabled } = this.props;
		const { isFocused } = this.state;

		if (!isDisabled && isFocused) {
			if (event.deltaY < 0) {
				this.increase();
			} else {
				this.decrease();
			}
		}
	}

	private decrease = () => {
		this.step(-1);
	}

	private increase = () => {
		this.step(1);
	}

	onIncrement = () => {
		this.increase();
	}

	onDecrement = () => {
		this.decrease();
	}

}

export type TNumericStepperProps = ObjectClean<PartialKeys<TNumericStepperFullProps, 'theme' | 'SteppableInput' | 'step' | 'max' | 'min' | 'manualEdit' >>;
export const NumericStepper: ComponentClass<TNumericStepperProps> = withTheme(NUMERIC_STEPPER)(RawNumericStepper);