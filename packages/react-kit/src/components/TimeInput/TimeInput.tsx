import * as React from 'react';
import { PURE } from '../../utils/pure';
import { ComponentClass } from 'react';
import { TControlProps, KeyCode, KEY_CODE_NUM_MAP } from '../Control/Control';
import * as classnames from 'classnames';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { SteppableInput, TSteppableInputProps } from '../SteppableInput/SteppableInput';
import { withDefaults } from '../../utils/with-defaults';

export const TIME_INPUT = Symbol('TimeInput') as symbol;

export type TTime = {
	hours: number;
	minutes: number;
};

export enum ActiveSection {
	Hours,
	Minutes,
}

export type TTimeInputOwnProps = TSteppableInputProps & TControlProps<TTime | undefined | null>;

export type TTimeInputFullProps = TTimeInputOwnProps & {
	SteppableInput: React.ComponentClass<TSteppableInputProps> | React.SFC<TSteppableInputProps>;
	theme: {
		inner?: string;
		inner_isFilled?: string;
		section?: string;
		section_isActive?: string;
		separator?: string;
		SteppableInput?: TSteppableInputProps['theme'];
	};
};

export type TTimeInputState = {
	activeSection?: ActiveSection;
	hours?: number;
	minutes?: number;
};

@PURE
class RawTimeInput extends React.Component<TTimeInputFullProps, TTimeInputState> {
	readonly state: TTimeInputState = {};
	private secondInput: boolean = false;

	componentWillMount() {
		const { value } = this.props;
		if (value) {
			const { hours, minutes } = value;
			this.setState({
				hours,
				minutes,
			});
		}
	}

	componentWillReceiveProps(newProps: TTimeInputFullProps) {
		if (this.props.value !== newProps.value && isDefined(newProps.value)) {
			//value can be null here
			let hours;
			let minutes;
			if (newProps.value) {
				hours = newProps.value.hours;
				minutes = newProps.value.minutes;
			}
			this.setState({
				hours,
				minutes,
			});
		}
	}

	render() {
		const { theme, decrementIcon, incrementIcon, isDisabled, clearIcon, error, value, SteppableInput } = this.props;
		const { hours, minutes, activeSection } = this.state;

		const hoursClassName = classnames(theme.section, {
			[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.Hours,
		});

		const minutesClassName = classnames(theme.section, {
			[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.Minutes,
		});

		let onClear;
		if ((isDefined(value) && value !== null) || isDefined(hours) || isDefined(minutes)) {
			onClear = this.onClear;
		}

		const innerClassName = classnames(theme.inner, {
			[theme.inner_isFilled as string]: Boolean(value),
		});

		return (
			<SteppableInput
				isDisabled={isDisabled}
				theme={theme.SteppableInput}
				onBlur={this.onBlur}
				error={error}
				onFocus={this.onFocus}
				decrementIcon={decrementIcon}
				incrementIcon={incrementIcon}
				clearIcon={clearIcon}
				onKeyDown={this.onKeyDown}
				onClear={onClear}
				onDecrement={this.onDecrement}
				onIncrement={this.onIncrement}>
				<div className={innerClassName}>
					<span className={hoursClassName} onMouseDown={this.onHoursMouseDown}>
						{this.format(hours)}
					</span>
					<span className={theme.separator}>:</span>
					<span className={minutesClassName} onMouseDown={this.onMinutesMouseDown}>
						{this.format(minutes)}
					</span>
				</div>
			</SteppableInput>
		);
	}

	private format(value?: number): string {
		if (isDefined(value)) {
			return `${value >= 0 && value < 10 ? 0 : ''}${value}`;
		} else {
			return '--';
		}
	}

	private onHoursMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Hours,
			});
			this.correctMinutes();
		}
	};

	private onMinutesMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Minutes,
			});
		}
	};

	private onIncrement = () => {
		this.secondInput = false;
		this.step(1);
	};

	private onDecrement = () => {
		this.secondInput = false;
		this.step(-1);
	};

	private onClear = () => {
		this.secondInput = false;
		this.updateStateTime();
	};

	private onFocus = (e: React.FocusEvent<HTMLElement>) => {
		this.secondInput = false;
		if (!isDefined(this.state.activeSection)) {
			this.setState({
				activeSection: ActiveSection.Hours,
			});
		}
	};

	private onBlur = (e: React.FocusEvent<HTMLElement>) => {
		this.secondInput = false;
		this.correctMinutes();
		this.setState({
			activeSection: undefined,
		});
	};

	private onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		const { activeSection, hours, minutes } = this.state;
		switch (e.keyCode) {
			case KeyCode.Left: {
				e.preventDefault(); //block h-scrolling
				if (activeSection === ActiveSection.Minutes) {
					this.secondInput = false;
					this.correctMinutes();
					this.setState({
						activeSection: ActiveSection.Hours,
					});
				}
				break;
			}
			case KeyCode.Right: {
				e.preventDefault(); //block h-scrolling
				if (activeSection === ActiveSection.Hours) {
					this.secondInput = false;
					this.correctMinutes();
					this.setState({
						activeSection: ActiveSection.Minutes,
					});
				}
				break;
			}
			case KeyCode.Delete: //fallthrough
			case KeyCode.Backspace: {
				this.secondInput = false;
				switch (activeSection) {
					case ActiveSection.Minutes: {
						this.updateStateTime(hours, undefined);
						break;
					}
					case ActiveSection.Hours: {
						this.updateStateTime(undefined, minutes);
						break;
					}
				}
				break;
			}
			default: {
				const number = KEY_CODE_NUM_MAP[e.keyCode];
				if (isDefined(number)) {
					this.handleDigitKeyDown(number);
				}
			}
		}
	};

	private handleDigitKeyDown(digit: number) {
		const { hours, minutes } = this.state;
		switch (this.state.activeSection) {
			case ActiveSection.Hours: {
				if (this.secondInput && isDefined(hours)) {
					let newHours;
					if (hours < 2) {
						newHours = Number(`${hours}${digit}`);
					} else if (hours === 2) {
						newHours = Math.min(Number(`${hours}${digit}`), 23);
					} else {
						newHours = digit;
					}
					this.updateStateTime(newHours, minutes);
					this.setState({
						activeSection: ActiveSection.Minutes,
					});
					this.secondInput = false;
				} else {
					this.updateStateTime(digit, minutes);
					if (digit > 2) {
						this.setState({
							activeSection: ActiveSection.Minutes,
						});
						this.secondInput = false;
					} else {
						this.secondInput = true;
					}
				}
				break;
			}
			case ActiveSection.Minutes: {
				if (this.secondInput && isDefined(minutes)) {
					const newMinutes = Number(`${minutes >= 10 ? ('' + minutes)[1] : minutes}${digit}`);
					this.updateStateTime(hours, newMinutes);
				} else {
					this.updateStateTime(hours, digit);
					this.secondInput = true;
				}
			}
		}
	}

	private step(amount: number): void {
		const { hours, minutes, activeSection } = this.state;
		switch (activeSection) {
			case ActiveSection.Hours: {
				this.updateStateTime(add(hours, amount, 23), minutes);
				break;
			}
			case ActiveSection.Minutes: {
				this.updateStateTime(hours, add(Math.min(isDefined(minutes) ? minutes : Infinity, 59), amount, 59));
				break;
			}
		}
	}

	private updateStateTime(hours?: number, minutes?: number): void {
		const { onValueChange, value } = this.props;

		const canBuildValue = isDefined(hours) && isDefined(minutes) && minutes < 60;
		const newValueDiffers =
			canBuildValue &&
			(!isDefined(value) || value === null || value.hours !== hours || value.minutes !== minutes);

		if (canBuildValue) {
			if (newValueDiffers) {
				onValueChange &&
					onValueChange({
						hours,
						minutes,
					} as any);
			}
		} else {
			if (isDefined(this.props.value)) {
				onValueChange && onValueChange(undefined);
			}
			this.setState({
				hours,
				minutes,
			});
		}
	}

	private correctMinutes() {
		const { minutes } = this.state;
		if (isDefined(minutes) && minutes >= 60) {
			this.updateStateTime(this.state.hours, 59);
		}
	}
}

export type TTimeInputProps = PartialKeys<TTimeInputFullProps, 'theme' | 'SteppableInput'>;
export const TimeInput: ComponentClass<TTimeInputProps> = withTheme(TIME_INPUT)(
	withDefaults<TTimeInputFullProps, 'SteppableInput'>({
		SteppableInput,
	})(RawTimeInput),
);

/**
 * Values can be zeros (start from 0). Max is included value.
 */
function add(a: number | undefined, b: number, max: number): number {
	if (!isDefined(a)) {
		return b < 0 ? max : 0;
	}
	let result = (a + b) % (max + 1);
	if (result < 0) {
		result += max + 1;
	}
	return result;
}

function isDefined<A>(value?: A): value is A {
	return typeof value !== 'undefined';
}
