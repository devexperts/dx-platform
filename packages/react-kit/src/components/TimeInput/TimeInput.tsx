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
	withDayType?: boolean;
};

export type TTime = {
	hours: number;
	minutes: number;
	seconds?: number;
	dayType?: string;
};

export enum ActiveSection {
	Hours,
	Minutes,
	Seconds,
	DayType,
}

export enum DayType {
	AM,
	PM,
}

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
	dayType?: DayType;
};

@PURE
class RawTimeInput extends React.Component<TTimeInputFullProps, TTimeInputState> {
	readonly state: TTimeInputState = {};
	private secondInput: boolean = false;
	private fourthInput: boolean = false;

	componentWillMount() {
		const { value, withSeconds, withDayType } = this.props;
		if (value) {
			const { hours, minutes, seconds, dayType } = value;
			this.setState({
				hours,
				minutes,
			});
			if (withSeconds) {
				this.setState({ seconds });
			}
			if (withDayType) {
				this.setState({ dayType: stringToDayType(dayType) });
			}
		}
	}

	componentWillReceiveProps(newProps: TTimeInputFullProps) {
		const { withSeconds, withDayType } = this.props;
		if (this.props.value !== newProps.value && isDefined(newProps.value)) {
			//value can be null here
			let hours;
			let minutes;
			let seconds;
			let dayType;
			if (newProps.value) {
				hours = newProps.value.hours;
				minutes = newProps.value.minutes;
				seconds = newProps.value.seconds;
				dayType = newProps.value.dayType;
			}
			this.setState({
				hours,
				minutes,
			});
			if (withSeconds) {
				this.setState({ seconds });
			}
			if (withDayType) {
				this.setState({ dayType: stringToDayType(dayType) });
			}
		}
	}

	render() {
		const { theme, decrementIcon, incrementIcon, isDisabled, clearIcon, error, value, SteppableInput } = this.props;
		const { hours, minutes, seconds, dayType, activeSection } = this.state;
		const { withSeconds, withDayType } = this.props;

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

		let dayTypeClassName;
		if (withDayType) {
			dayTypeClassName = classnames(theme.section, {
				[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.DayType,
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
					{withDayType && (
						<Fragment>
							&nbsp;
							<span className={dayTypeClassName} onMouseDown={this.onDayTypeDown}>
								{this.formatDayType(dayTypeToString(dayType))}
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

	private formatDayType(value?: string): string {
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
			this.correctTime();
		}
	};

	private onMinutesMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Minutes,
			});
		}
	};

	private onSecondsMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Seconds,
			});
		}
	};

	private onDayTypeDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.DayType,
			});
		}
	};

	private onIncrement = () => {
		this.secondInput = false;
		this.fourthInput = false;
		this.step(1);
	};

	private onDecrement = () => {
		this.secondInput = false;
		this.fourthInput = false;
		this.step(-1);
	};

	private onClear = () => {
		this.secondInput = false;
		this.fourthInput = false;
		this.updateStateTime();
	};

	private onFocus = (e: React.FocusEvent<HTMLElement>) => {
		this.secondInput = false;
		this.fourthInput = false;
		if (!isDefined(this.state.activeSection)) {
			this.setState({
				activeSection: ActiveSection.Hours,
			});
		}
	};

	private onBlur = (e: React.FocusEvent<HTMLElement>) => {
		this.secondInput = false;
		this.fourthInput = false;
		this.correctTime();
		this.setState({
			activeSection: undefined,
		});
	};

	private onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		const { activeSection, hours, minutes, seconds, dayType } = this.state;
		const { withSeconds, withDayType } = this.props;

		switch (e.keyCode) {
			case KeyCode.Left: {
				e.preventDefault(); //block h-scrolling
				this.secondInput = false;
				this.fourthInput = false;
				this.correctTime();
				this.setState({
					activeSection: findActiveSectionOnKeyLeft(activeSection, withSeconds),
				});
				break;
			}
			case KeyCode.Right: {
				e.preventDefault(); //block h-scrolling
				this.secondInput = false;
				this.fourthInput = false;
				this.correctTime();
				this.setState({
					activeSection: findActiveSectionOnKeyRight(activeSection, withSeconds, withDayType),
				});
				break;
			}
			case KeyCode.Delete: //fallthrough
			case KeyCode.Backspace: {
				this.secondInput = false;
				this.fourthInput = false;
				switch (activeSection) {
					case ActiveSection.Hours: {
						this.updateStateTime(undefined, minutes, seconds, dayType);
						break;
					}
					case ActiveSection.Minutes: {
						this.updateStateTime(hours, undefined, seconds, dayType);
						break;
					}
					case ActiveSection.Seconds: {
						this.updateStateTime(hours, minutes, undefined, dayType);
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
		const { hours, minutes, seconds, dayType, activeSection } = this.state;
		const currentDayTypeStringed = dayTypeToString(dayType);
		if (
			(activeSection === ActiveSection.DayType && letter === KEY_CODE_LETR_MAP[KeyCode.LETR_A]) ||
			(activeSection === ActiveSection.DayType && letter === KEY_CODE_LETR_MAP[KeyCode.LETR_P])
		) {
			const newDayType = `${letter}${currentDayTypeStringed.slice(1)}`;
			this.updateStateTime(hours, minutes, seconds, stringToDayType(newDayType));
		}
	}

	private handleDigitKeyDown(digit: number) {
		const { hours, minutes, seconds, dayType, activeSection } = this.state;
		switch (activeSection) {
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
					this.updateStateTime(newHours, minutes, seconds, dayType);
					this.setState({
						activeSection: ActiveSection.Minutes,
					});
					this.secondInput = false;
				} else {
					this.updateStateTime(digit, minutes, seconds, dayType);
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
					this.updateStateTime(hours, newMinutes, seconds, dayType);
					if (this.props.withSeconds) {
						this.setState({
							activeSection: ActiveSection.Seconds,
						});
					} else if (this.props.withDayType) {
						this.setState({
							activeSection: ActiveSection.DayType,
						});
					}
				} else {
					this.updateStateTime(hours, digit, seconds, dayType);
					this.secondInput = true;
				}
				break;
			}
			case ActiveSection.Seconds: {
				if (isDefined(seconds)) {
					const newSeconds = Number(`${seconds >= 10 ? ('' + seconds)[1] : seconds}${digit}`);
					this.updateStateTime(hours, minutes, newSeconds, dayType);
					if (this.props.withDayType) {
						if (!this.fourthInput) {
							this.fourthInput = true;
						} else {
							this.setState({
								activeSection: ActiveSection.DayType,
							});
							this.fourthInput = false;
						}
					}
				} else {
					this.updateStateTime(hours, minutes, digit, dayType);
					if (this.props.withDayType) {
						this.fourthInput = true;
					}
				}
				break;
			}
		}
	}

	private step(amount: number): void {
		const { hours, minutes, seconds, dayType, activeSection } = this.state;
		switch (activeSection) {
			case ActiveSection.Hours: {
				this.updateStateTime(add(hours, amount, 23), minutes, seconds, dayType);
				break;
			}
			case ActiveSection.Minutes: {
				this.updateStateTime(hours, add(minutes, amount, 59), seconds, dayType);
				break;
			}
			case ActiveSection.Seconds: {
				this.updateStateTime(hours, minutes, add(seconds, amount, 59), dayType);
				break;
			}
			case ActiveSection.DayType: {
				this.updateStateTime(hours, minutes, seconds, toggleDayType(dayType));
				break;
			}
		}
	}

	private updateStateTime(hours?: number, minutes?: number, seconds?: number, dayType?: DayType): void {
		const { onValueChange, value, withSeconds, withDayType } = this.props;
		const stringDayType = dayTypeToString(dayType);

		const canBuildValue = isDefined(hours) && isDefined(minutes) && minutes < 60;
		const newValueDiffers =
			canBuildValue &&
			(!isDefined(value) ||
				value === null ||
				value.hours !== hours ||
				value.minutes !== minutes ||
				value.seconds !== seconds ||
				value.dayType !== stringDayType);
		if (canBuildValue) {
			if (newValueDiffers) {
				const newValue = {
					hours,
					minutes,
				};
				if (withSeconds && isDefined(seconds)) {
					newValue['seconds'] = seconds;
				}
				if (withDayType && isDefined(dayType)) {
					newValue['dayType'] = stringDayType;
				}
				onValueChange &&
					onValueChange({
						...newValue,
					} as any);
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
				newValue['seconds'] = seconds;
			} else if (withSeconds && !isDefined(seconds)) {
				newValue['seconds'] = undefined;
			}
			if (withDayType && isDefined(dayType)) {
				newValue['dayType'] = dayType;
			}
			this.setState({
				...newValue,
			});
		}
	}

	private correctTime() {
		const { withSeconds } = this.props;
		const { minutes, hours, seconds, dayType } = this.state;
		const isMinutesInvalid = isDefined(minutes) && minutes >= 60;
		const isSecondsInvalid = withSeconds && isDefined(seconds) && seconds >= 60;
		if (isMinutesInvalid || isSecondsInvalid) {
			const correctedMinutes = isMinutesInvalid ? 59 : minutes;
			const correctedSeconds = isSecondsInvalid ? 59 : seconds;
			this.updateStateTime(hours, correctedMinutes, correctedSeconds, dayType);
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
		case ActiveSection.DayType: {
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
				return ActiveSection.DayType;
			} else {
				return ActiveSection.Minutes;
			}
		}
		case ActiveSection.Seconds: {
			return isClockFormatExist ? ActiveSection.DayType : ActiveSection.Seconds;
		}
		case ActiveSection.DayType: {
			return ActiveSection.DayType;
		}
		default:
			return ActiveSection.Hours;
	}
}

function stringToDayType(dayType?: string): DayType {
	const dayTypeToUpperCase = isDefined(dayType) && dayType.toLowerCase();
	switch (dayTypeToUpperCase) {
		case 'am':
			return DayType.AM;
		case 'pm':
			return DayType.PM;
		default:
			return DayType.AM;
	}
}

function dayTypeToString(dayType?: DayType): string {
	switch (dayType) {
		case DayType.AM:
			return 'am';
		case DayType.PM:
			return 'pm';
		default:
			return 'am';
	}
}

function toggleDayType(dayType?: DayType): DayType {
	switch (dayType) {
		case DayType.AM:
			return DayType.PM;
		case DayType.PM:
			return DayType.AM;
		default:
			return DayType.AM;
	}
}
