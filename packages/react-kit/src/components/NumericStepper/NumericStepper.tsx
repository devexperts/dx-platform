import React from 'react';
import { SteppableInput, TSteppableInputProps } from '../SteppableInput/SteppableInput';
import { KeyCode, TControlProps } from '../Control/Control';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { ComponentClass } from 'react';
import { Input, TInputProps } from '../input/Input';
import { withDefaults } from '../../utils/with-defaults';
import { fromNullable, getOrElse } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';

export const NUMERIC_STEPPER = Symbol('NumericStepper') as symbol;

export type TNumericStepperOwnProps = TSteppableInputProps &
	TControlProps<any> & {
		step: number;
		min: number;
		max: number;
		parser?: any;
		formatter?: any;
		manualEdit: boolean;
	};

export type TNumericStepperFullProps = TNumericStepperOwnProps & {
	SteppableInput: React.ComponentClass<TSteppableInputProps> | React.SFC<TSteppableInputProps>;
	theme: {
		SteppableInput?: TSteppableInputProps['theme'];
		Input?: TInputProps['theme'];
	};
};

type TNumericStepperState = {
	isFocused: boolean;
	displayedValue: any;
};

class RawNumericStepper extends React.Component<TNumericStepperFullProps, TNumericStepperState> {
	static propTypes: any = {
		value(props: TNumericStepperFullProps) {
			const { value, min, max } = props;
			const type = typeof value;

			if (type === 'number' && (value < min || value > max)) {
				throw new Error(`Value: ${value} should be greater than min: ${min} and lower than max: ${max}`);
			}
		},
		min(props: TNumericStepperFullProps) {
			const { min, max } = props;
			const type = typeof min;
			if (type !== 'undefined') {
				if (type !== 'number') {
					throw new Error('Min should be a number');
				} else {
					if (min >= max) {
						throw new Error('Invalid min value. Min value should be lower than max');
					}
				}
			}
		},
		max(props: TNumericStepperFullProps) {
			const { min, max } = props;
			const type = typeof max;
			if (type !== 'undefined') {
				if (type !== 'number') {
					throw new Error('Max should be a string or a number');
				} else {
					if (max <= min) {
						throw new Error('Invalid Max value. Max value should be greater than min');
					}
				}
			}
		},
	};

	constructor(props: TNumericStepperFullProps) {
		super(props);

		const state: TNumericStepperState = {
			isFocused: false,
			displayedValue: props.value,
		};

		if (props.value) {
			state.displayedValue = this.formatValue(props.value);
		}

		this.state = state;
	}

	componentWillReceiveProps(newProps: TNumericStepperFullProps) {
		this.setState({
			displayedValue: this.formatValue(newProps.value),
		});
	}

	render() {
		const { displayedValue } = this.state;

		const {
			theme,
			decrementIcon,
			incrementIcon,
			value,
			isDisabled,
			clearIcon,
			min,
			max,
			SteppableInput,
		} = this.props;

		const hasError = isNaN(value) || value < min || value > max;

		const isIncrementButtonDisabled = value >= max;
		const isDecrementButtonDisabled = value <= min;

		return (
			<SteppableInput
				isDisabled={isDisabled}
				isDecrementButtonDisabled={isDecrementButtonDisabled}
				isIncrementButtonDisabled={isIncrementButtonDisabled}
				error={hasError}
				theme={theme.SteppableInput}
				onDecrement={this.onDecrement}
				onIncrement={this.onIncrement}
				decrementIcon={decrementIcon}
				incrementIcon={incrementIcon}
				clearIcon={clearIcon}>
				<Input
					type="text"
					onKeyDown={this.onKeyDown}
					onFocus={this.onFocus}
					onWheel={this.onWheel}
					tabIndex={-1}
					error={hasError}
					theme={theme.Input}
					isDisabled={isDisabled}
					value={`${displayedValue}`}
					onBlur={this.onBlur}
					onValueChange={this.onInputChange}
				/>
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
	};

	private onInputChange = (value: string | undefined) => {
		if (!this.props.manualEdit) {
			return;
		}
		if (this.state.isFocused) {
			const { onValueChange } = this.props;
			const newValue = this.parseValue(
				pipe(
					fromNullable(value),
					getOrElse(() => ''),
				),
			);

			this.setState({
				displayedValue: this.formatValue(newValue),
			});

			onValueChange && onValueChange(newValue);
		}
	};

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
			isFocused: true,
		});
	};

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
		const { manualEdit, onValueChange } = this.props;
		if (!manualEdit) {
			return;
		}

		const { value } = event.target;
		const newValue = this.parseValue(value as string);

		this.setState({
			isFocused: false,
			displayedValue: this.formatValue(newValue),
		});

		onValueChange && onValueChange(newValue);
	};

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
	};

	private decrease = () => {
		this.step(-1);
	};

	private increase = () => {
		this.step(1);
	};

	onIncrement = () => {
		this.increase();
	};

	onDecrement = () => {
		this.decrease();
	};
}

export type TNumericStepperProps = PartialKeys<
	TNumericStepperFullProps,
	'theme' | 'SteppableInput' | 'step' | 'max' | 'min' | 'manualEdit'
>;
export const NumericStepper: ComponentClass<TNumericStepperProps> = withTheme(NUMERIC_STEPPER)(
	withDefaults<TNumericStepperFullProps, 'SteppableInput' | 'step' | 'max' | 'min' | 'manualEdit'>({
		step: 1,
		manualEdit: true,
		min: Number.NEGATIVE_INFINITY,
		max: Number.POSITIVE_INFINITY,
		SteppableInput,
	})(RawNumericStepper),
);
