import * as React from 'react';
import { PURE } from '../../utils/pure';
import { ComponentClass } from 'react';
import { TControlProps, KeyCode, KEY_CODE_NUM_MAP, KEY_CODE_LETR_MAP } from '../Control/Control';
import * as classnames from 'classnames';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { SteppableInput, TSteppableInputProps } from '../SteppableInput/SteppableInput';
import { withDefaults } from '../../utils/with-defaults';
import { Fragment } from 'react';

export const TIME_INPUT = Symbol('TimeInput') as symbol;

type TTimeInputConfig = {
	withSeconds?: boolean;
	withPeriodType?: boolean;
};

export type TTime = {
	hours: number;
	minutes: number;
	seconds?: number;
	periodType?: string;
};

export enum ActiveSection {
	Hours,
	Minutes,
	Seconds,
	PeriodType,
}

export enum PeriodType {
	AM,
	PM,
}

const secondsField = 'seconds';
const periodTypeField = 'periodType';

export type TTimeInputOwnProps = TTimeInputConfig & TSteppableInputProps & TControlProps<TTime | undefined | null>;

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
	seconds?: number;
	periodType?: PeriodType;
};

@PURE
class RawTimeInput extends React.Component<TTimeInputFullProps, TTimeInputState> {
	readonly state: TTimeInputState = {};
	// Helper, which helps to detect order of input in the two-digit field;
	private secondInput: boolean = false;

	componentWillMount() {
		const { value, withSeconds, withPeriodType } = this.props;
		if (value) {
			const { hours, minutes, seconds, periodType } = value;
			const initValue: TTimeInputState = {
				hours,
				minutes,
			};
			if (withSeconds && isDefined(seconds)) {
				initValue[secondsField] = seconds;
			}
			if (withPeriodType && isDefined(periodType)) {
				initValue[periodTypeField] = stringToPeriodType(periodType);
			} else if (withPeriodType && !isDefined(periodType)) {
				// set default period type if it is not defined by parent component
				initValue[periodTypeField] = PeriodType.AM;
			}
			this.setState({
				...initValue,
			});
		}
	}

	componentWillReceiveProps(newProps: TTimeInputFullProps) {
		const { withSeconds, withPeriodType } = this.props;
		if (this.props.value !== newProps.value && isDefined(newProps.value)) {
			//value can be null here
			let hours;
			let minutes;
			let seconds;
			let periodType;
			if (newProps.value) {
				hours = newProps.value.hours;
				minutes = newProps.value.minutes;
				seconds = newProps.value.seconds;
				periodType = newProps.value.periodType;
			}
			const newValue: TTimeInputState = {
				hours,
				minutes,
			};
			if (withSeconds) {
				newValue[secondsField] = seconds;
			}
			if (withPeriodType) {
				newValue[periodTypeField] = stringToPeriodType(periodType);
			}
			this.setState({
				...newValue,
			});
		}
	}

	render() {
		const { theme, decrementIcon, incrementIcon, isDisabled, clearIcon, error, value, SteppableInput } = this.props;
		const { hours, minutes, seconds, periodType, activeSection } = this.state;
		const { withSeconds, withPeriodType } = this.props;

		const hoursClassName = classnames(theme.section, {
			[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.Hours,
		});

		const minutesClassName = classnames(theme.section, {
			[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.Minutes,
		});

		let secondsClassName;
		if (withSeconds) {
			secondsClassName = classnames(theme.section, {
				[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.Seconds,
			});
		}

		let periodTypeClassName;
		if (withPeriodType) {
			periodTypeClassName = classnames(theme.section, {
				[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.PeriodType,
			});
		}

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
					{withSeconds && (
						<Fragment>
							<span className={theme.separator}>:</span>
							<span className={secondsClassName} onMouseDown={this.onSecondsMouseDown}>
								{this.format(seconds)}
							</span>
						</Fragment>
					)}
					{withPeriodType && (
						<Fragment>
							&nbsp;
							<span className={periodTypeClassName} onMouseDown={this.onPeriodTypeDown}>
								{this.formatPeriodType(periodTypeToString(periodType))}
							</span>
						</Fragment>
					)}
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

	private formatPeriodType(value?: string): string {
		if (isDefined(value)) {
			return value;
		} else {
			return 'am';
		}
	}

	private onHoursMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Hours,
			});
			this.secondInput = false;
			this.correctTime();
		}
	};

	private onMinutesMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Minutes,
			});
			this.secondInput = false;
			this.correctTime();
		}
	};

	private onSecondsMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Seconds,
			});
			this.secondInput = false;
			this.correctTime();
		}
	};

	private onPeriodTypeDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.PeriodType,
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
		this.correctTime();
		this.setState({
			activeSection: undefined,
		});
	};

	private onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		const { activeSection, hours, minutes, seconds, periodType } = this.state;
		const { withSeconds, withPeriodType } = this.props;

		switch (e.keyCode) {
			case KeyCode.Left: {
				e.preventDefault(); //block h-scrolling
				this.secondInput = false;
				this.correctTime();
				this.setState({
					activeSection: findActiveSectionOnKeyLeft(activeSection, withSeconds),
				});
				break;
			}
			case KeyCode.Right: {
				e.preventDefault(); //block h-scrolling
				this.secondInput = false;
				this.correctTime();
				this.setState({
					activeSection: findActiveSectionOnKeyRight(activeSection, withSeconds, withPeriodType),
				});
				break;
			}
			case KeyCode.Delete: //fallthrough
			case KeyCode.Backspace: {
				this.secondInput = false;
				switch (activeSection) {
					case ActiveSection.Hours: {
						this.updateStateTime(undefined, minutes, seconds, periodType);
						break;
					}
					case ActiveSection.Minutes: {
						this.updateStateTime(hours, undefined, seconds, periodType);
						break;
					}
					case ActiveSection.Seconds: {
						this.updateStateTime(hours, minutes, undefined, periodType);
						break;
					}
				}
				break;
			}
			default: {
				if (isNumber(KEY_CODE_NUM_MAP[e.keyCode])) {
					this.handleDigitKeyDown(KEY_CODE_NUM_MAP[e.keyCode]);
				} else if (isString(KEY_CODE_LETR_MAP[e.keyCode])) {
					this.handleLetterKeyDown(KEY_CODE_LETR_MAP[e.keyCode]);
				}
			}
		}
	};

	private handleLetterKeyDown(letter: string) {
		const { hours, minutes, seconds, periodType, activeSection } = this.state;
		const currentPeriodTypeStringed = periodTypeToString(periodType);
		if (
			(activeSection === ActiveSection.PeriodType && letter === KEY_CODE_LETR_MAP[KeyCode.LETR_A]) ||
			(activeSection === ActiveSection.PeriodType && letter === KEY_CODE_LETR_MAP[KeyCode.LETR_P])
		) {
			const newPeriodType = `${letter}${currentPeriodTypeStringed.slice(1)}`;
			this.updateStateTime(hours, minutes, seconds, stringToPeriodType(newPeriodType));
		}
	}

	private handleDigitKeyDown(digit: number) {
		const { hours, minutes, seconds, periodType, activeSection } = this.state;
		const { withPeriodType = false, withSeconds = false } = this.props;

		switch (activeSection) {
			case ActiveSection.Hours: {
				if (this.secondInput && isDefined(hours)) {
					let newHours;
					if (!withPeriodType) {
						if (hours < 2) {
							newHours = Number(`${hours}${digit}`);
						} else if (hours === 2) {
							newHours = Math.min(Number(`${hours}${digit}`), 23);
						} else {
							newHours = digit;
						}
						this.updateStateTime(newHours, minutes, seconds, periodType);
						this.setState({
							activeSection: ActiveSection.Minutes,
						});
						this.secondInput = false;
					} else {
						if (hours < 2) {
							newHours = Math.min(Number(`${hours}${digit}`), 12);
						} else {
							newHours = digit;
						}
						this.updateStateTime(newHours, minutes, seconds, periodType);
						this.setState({
							activeSection: ActiveSection.Minutes,
						});
						this.secondInput = false;
					}
				} else {
					this.updateStateTime(digit, minutes, seconds, periodType);
					if (digit > 2 && !withPeriodType) {
						this.setState({
							activeSection: ActiveSection.Minutes,
						});
						this.secondInput = false;
					} else if (digit > 1 && withPeriodType) {
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
				if (!withSeconds) {
					let newMinutes;
					if (this.secondInput) {
						newMinutes = isDefined(minutes) ? Number(`${minutes % 10}${digit}`) : digit;
					} else {
						newMinutes = digit;
						this.secondInput = true;
					}
					this.updateStateTime(hours, newMinutes, seconds, periodType);
				} else {
					if (this.secondInput && isDefined(minutes)) {
						const newMinutes = Number(`${minutes}${digit}`);
						this.updateStateTime(hours, newMinutes, seconds, periodType);
						if (withSeconds) {
							this.setState({
								activeSection: ActiveSection.Seconds,
							});
						} else if (withPeriodType) {
							this.setState({
								activeSection: ActiveSection.PeriodType,
							});
						}
						this.updateStateTime(hours, newMinutes, seconds, periodType);
						this.secondInput = false;
					} else {
						const newMinutes = digit;
						if (digit > 5 && (withPeriodType || withSeconds)) {
							if (withSeconds) {
								this.setState({
									activeSection: ActiveSection.Seconds,
								});
							} else if (withPeriodType) {
								this.setState({
									activeSection: ActiveSection.PeriodType,
								});
							}
							this.secondInput = false;
						} else {
							this.secondInput = true;
						}
						this.updateStateTime(hours, newMinutes, seconds, periodType);
					}
				}
				break;
			}
			case ActiveSection.Seconds: {
				let newSeconds;
				if (this.secondInput) {
					newSeconds = isDefined(seconds) ? Number(`${seconds % 10}${digit}`) : digit;
				} else {
					newSeconds = digit;
					this.secondInput = true;
				}
				this.updateStateTime(hours, minutes, newSeconds, periodType);
				break;
			}
		}
	}

	private step(amount: number): void {
		const { hours, minutes, seconds, periodType, activeSection } = this.state;
		const { withPeriodType } = this.props;
		switch (activeSection) {
			case ActiveSection.Hours: {
				if (withPeriodType) {
					this.updateStateTime(add(hours, amount, 12), minutes, seconds, periodType);
				} else {
					this.updateStateTime(add(hours, amount, 23), minutes, seconds, periodType);
				}
				break;
			}
			case ActiveSection.Minutes: {
				this.updateStateTime(hours, add(minutes, amount, 59), seconds, periodType);
				break;
			}
			case ActiveSection.Seconds: {
				this.updateStateTime(hours, minutes, add(seconds, amount, 59), periodType);
				break;
			}
			case ActiveSection.PeriodType: {
				this.updateStateTime(hours, minutes, seconds, togglePeriodType(periodType));
				break;
			}
		}
	}

	private updateStateTime(hours?: number, minutes?: number, seconds?: number, periodType?: PeriodType): void {
		const { onValueChange, value, withSeconds, withPeriodType } = this.props;
		const stringedPeriodType = periodTypeToString(periodType);

		let canBuildValue;
		const isValidHoursAndMins = isDefined(hours) && isDefined(minutes) && minutes < 60;
		if (!withSeconds && !withPeriodType) {
			canBuildValue = isValidHoursAndMins;
		} else if (withSeconds && withPeriodType) {
			canBuildValue = isValidHoursAndMins && isDefined(seconds) && seconds < 60 && isDefined(periodType);
		} else if (withSeconds) {
			canBuildValue = isValidHoursAndMins && isDefined(seconds) && seconds < 60;
		} else if (withPeriodType) {
			canBuildValue = isValidHoursAndMins && isDefined(periodType);
		}
		const newValueDiffers =
			canBuildValue &&
			(!isDefined(value) ||
				value === null ||
				value.hours !== hours ||
				value.minutes !== minutes ||
				value.seconds !== seconds ||
				value.periodType !== stringedPeriodType);
		if (canBuildValue) {
			if (newValueDiffers) {
				const newValue = {
					hours,
					minutes,
				};
				if (withSeconds && isDefined(seconds)) {
					newValue[secondsField] = seconds;
				}
				if (withPeriodType && isDefined(periodType)) {
					newValue[periodTypeField] = stringedPeriodType;
				}
				onValueChange &&
					onValueChange({
						...newValue,
					} as TTime);
			}
		} else {
			if (isDefined(this.props.value)) {
				onValueChange && onValueChange(undefined);
			}
			const newValue = {
				hours,
				minutes,
			};
			if (withSeconds && isDefined(seconds)) {
				newValue[secondsField] = seconds;
			} else if (withSeconds && !isDefined(seconds)) {
				newValue[secondsField] = undefined;
			}
			if (withPeriodType && isDefined(periodType)) {
				newValue[periodTypeField] = periodType;
			}
			this.setState({
				...newValue,
			});
		}
	}

	private correctTime() {
		const { withSeconds } = this.props;
		const { minutes, hours, seconds, periodType } = this.state;
		const isMinutesInvalid = isDefined(minutes) && minutes >= 60;
		const isSecondsInvalid = withSeconds && isDefined(seconds) && seconds >= 60;
		if (isMinutesInvalid || isSecondsInvalid) {
			const correctedMinutes = isMinutesInvalid ? 59 : minutes;
			const correctedSeconds = isSecondsInvalid ? 59 : seconds;
			this.updateStateTime(hours, correctedMinutes, correctedSeconds, periodType);
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

function isNumber<A>(val: A | number): val is number {
	return typeof val === 'number' && !isNaN(val) && isFinite(val);
}

function isString<A>(val: A | string): val is string {
	return typeof val === 'string';
}

function findActiveSectionOnKeyLeft(activeState?: ActiveSection, isSecondsExist?: boolean): ActiveSection {
	switch (activeState) {
		case ActiveSection.PeriodType: {
			return isSecondsExist ? ActiveSection.Seconds : ActiveSection.Minutes;
		}
		case ActiveSection.Seconds: {
			return ActiveSection.Minutes;
		}
		case ActiveSection.Minutes: {
			return ActiveSection.Hours;
		}
		default:
			return ActiveSection.Hours;
	}
}

function findActiveSectionOnKeyRight(
	activeSection?: ActiveSection,
	isSecondsExist?: boolean,
	isClockFormatExist?: boolean,
): ActiveSection {
	switch (activeSection) {
		case ActiveSection.Hours: {
			return ActiveSection.Minutes;
		}
		case ActiveSection.Minutes: {
			if (isSecondsExist) {
				return ActiveSection.Seconds;
			} else if (isClockFormatExist) {
				return ActiveSection.PeriodType;
			} else {
				return ActiveSection.Minutes;
			}
		}
		case ActiveSection.Seconds: {
			return isClockFormatExist ? ActiveSection.PeriodType : ActiveSection.Seconds;
		}
		case ActiveSection.PeriodType: {
			return ActiveSection.PeriodType;
		}
		default:
			return ActiveSection.Hours;
	}
}

function stringToPeriodType(stringedPeriodType?: string): PeriodType {
	const periodTypeToLowerCase = isDefined(stringedPeriodType) && stringedPeriodType.toLowerCase();
	switch (periodTypeToLowerCase) {
		case 'am':
			return PeriodType.AM;
		case 'pm':
			return PeriodType.PM;
		default:
			return PeriodType.AM;
	}
}

function periodTypeToString(periodType?: PeriodType): string {
	switch (periodType) {
		case PeriodType.AM:
			return 'am';
		case PeriodType.PM:
			return 'pm';
		default:
			return 'am';
	}
}

function togglePeriodType(periodType?: PeriodType): PeriodType {
	switch (periodType) {
		case PeriodType.AM:
			return PeriodType.PM;
		case PeriodType.PM:
			return PeriodType.AM;
		default:
			return PeriodType.AM;
	}
}
