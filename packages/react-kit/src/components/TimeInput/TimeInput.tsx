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
import { none, Option, some } from 'fp-ts/lib/Option';
import { isTimesDifferent, Section, TTimeOption } from './TimeInput.model';

export const TIME_INPUT = Symbol('TimeInput') as symbol;

type TTimeInputConfig = {
	withSeconds?: boolean;
	withPeriodType?: boolean;
};

export type TTimeInputOwnProps = TTimeInputConfig & TSteppableInputProps & TControlProps<TTimeOption>;

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

type TTimeInputStateOption = {
	activeSection?: Section;
};

@PURE
class RawTimeInput extends React.Component<TTimeInputFullProps, TTimeInputStateOption> {
	readonly state: TTimeInputStateOption = {};
	// Helper, which helps to detect order of input in the two-digit field;
	private secondInput: boolean = false;

	render() {
		const { theme, decrementIcon, incrementIcon, isDisabled, clearIcon, error, value, SteppableInput } = this.props;
		const { hours, minutes, seconds, periodType } = value;
		const { withSeconds, withPeriodType } = this.props;

		let onClear;
		if ((isDefined(value) && value !== null) || hours.isSome() || minutes.isSome()) {
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
					<span className={this.getSectionClassName(Section.Hours)} onMouseDown={this.onHoursMouseDown}>
						{this.formatDigitOption(hours, Section.Hours)}
					</span>
					<span className={theme.separator}>:</span>
					<span className={this.getSectionClassName(Section.Minutes)} onMouseDown={this.onMinutesMouseDown}>
						{this.formatDigitOption(minutes, Section.Minutes)}
					</span>
					{withSeconds && (
						<Fragment>
							<span className={theme.separator}>:</span>
							<span
								className={this.getSectionClassName(Section.Seconds)}
								onMouseDown={this.onSecondsMouseDown}>
								{this.formatDigitOption(seconds, Section.Seconds)}
							</span>
						</Fragment>
					)}
					{withPeriodType && (
						<Fragment>
							&nbsp;
							<span
								className={this.getSectionClassName(Section.PeriodType)}
								onMouseDown={this.onPeriodTypeDown}>
								{this.formatDigitOption(periodType, Section.PeriodType)}
							</span>
						</Fragment>
					)}
				</div>
			</SteppableInput>
		);
	}

	private formatDigitOption(time: Option<string | number>, section: Section): string {
		return time.foldL(
			() => {
				return '--';
			},
			value => {
				switch (section) {
					//maybe we should use left-pad here? ;)
					case Section.Minutes: //fallthrough
					case Section.Seconds: {
						if (value < 10) {
							return `0${value}`;
						}
						return `${value}`;
					}
					case Section.Hours: {
						if (value < 10) {
							return `0${value}`;
						}
						return `${value}`;
					}
					case Section.PeriodType: {
						return `${value}`;
					}
				}
			},
		);
	}

	private getSectionClassName = (section: Section): string => {
		const { theme, isDisabled } = this.props;
		const { activeSection } = this.state;

		return classnames(theme.section, {
			[theme.section_isActive as string]: !isDisabled && activeSection === section,
		});
	};

	private onHoursMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: Section.Hours,
			});
			this.secondInput = false;
			this.correctTime();
		}
	};

	private onMinutesMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: Section.Minutes,
			});
			this.secondInput = false;
			this.correctTime();
		}
	};

	private onSecondsMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: Section.Seconds,
			});
			this.secondInput = false;
			this.correctTime();
		}
	};

	private onPeriodTypeDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: Section.PeriodType,
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
		this.updateStateTime(none, none, none, none);
	};

	private onFocus = (e: React.FocusEvent<HTMLElement>) => {
		this.secondInput = false;
		if (!isDefined(this.state.activeSection)) {
			this.setState({
				activeSection: Section.Hours,
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
		const { activeSection } = this.state;
		const { withSeconds, withPeriodType } = this.props;
		const { hours, minutes, seconds, periodType } = this.props.value;

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
					case Section.Hours: {
						this.updateStateTime(none, minutes, seconds, periodType);
						break;
					}
					case Section.Minutes: {
						this.updateStateTime(hours, none, seconds, periodType);
						break;
					}
					case Section.Seconds: {
						this.updateStateTime(hours, minutes, none, periodType);
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
		const { hours, minutes, seconds, periodType } = this.props.value;
		const { activeSection } = this.state;
		const currentPeriodTypeStringed = periodType.getOrElse('am');
		if (
			(activeSection === Section.PeriodType && letter === KEY_CODE_LETR_MAP[KeyCode.LETR_A]) ||
			(activeSection === Section.PeriodType && letter === KEY_CODE_LETR_MAP[KeyCode.LETR_P])
		) {
			const newPeriodType = `${letter.toLowerCase()}${currentPeriodTypeStringed.slice(1)}`;
			this.updateStateTime(hours, minutes, seconds, some(newPeriodType));
		}
	}

	private handleDigitKeyDown(digit: number) {
		const { activeSection } = this.state;
		const { withPeriodType = false, withSeconds = false } = this.props;
		const { hours, minutes, seconds, periodType } = this.props.value;

		switch (activeSection) {
			case Section.Hours: {
				if (this.secondInput && hours.isSome()) {
					let newHours;
					if (!withPeriodType) {
						if (hours.value < 2) {
							newHours = Number(`${hours.value}${digit}`);
						} else if (hours.value === 2) {
							newHours = Math.min(Number(`${hours.value}${digit}`), 23);
						} else {
							newHours = digit;
						}
						this.updateStateTime(some(newHours), minutes, seconds, periodType);
						this.setState({
							activeSection: Section.Minutes,
						});
						this.secondInput = false;
					} else {
						if (hours.value < 2) {
							newHours = Math.min(Number(`${hours.value}${digit}`), 12);
						} else {
							newHours = digit;
						}
						this.updateStateTime(some(newHours), minutes, seconds, periodType);
						this.setState({
							activeSection: Section.Minutes,
						});
						this.secondInput = false;
					}
				} else {
					this.updateStateTime(some(digit), minutes, seconds, periodType);
					if (digit > 2 && !withPeriodType) {
						this.setState({
							activeSection: Section.Minutes,
						});
						this.secondInput = false;
					} else if (digit > 1 && withPeriodType) {
						this.setState({
							activeSection: Section.Minutes,
						});
						this.secondInput = false;
					} else {
						this.secondInput = true;
					}
				}
				break;
			}
			case Section.Minutes: {
				if (!withSeconds) {
					let newMinutes;
					if (this.secondInput) {
						newMinutes = minutes.isSome() ? Number(`${minutes.value % 10}${digit}`) : digit;
					} else {
						newMinutes = digit;
						this.secondInput = true;
					}
					this.updateStateTime(hours, some(newMinutes), seconds, periodType);
				} else {
					if (this.secondInput && minutes.isSome()) {
						const newMinutes = Number(`${minutes.value}${digit}`);
						this.updateStateTime(hours, some(newMinutes), seconds, periodType);
						if (withSeconds) {
							this.setState({
								activeSection: Section.Seconds,
							});
						} else if (withPeriodType) {
							this.setState({
								activeSection: Section.PeriodType,
							});
						}
						this.updateStateTime(hours, some(newMinutes), seconds, periodType);
						this.secondInput = false;
					} else {
						const newMinutes = digit;
						if (digit > 5 && (withPeriodType || withSeconds)) {
							if (withSeconds) {
								this.setState({
									activeSection: Section.Seconds,
								});
							} else if (withPeriodType) {
								this.setState({
									activeSection: Section.PeriodType,
								});
							}
							this.secondInput = false;
						} else {
							this.secondInput = true;
						}
						this.updateStateTime(hours, some(newMinutes), seconds, periodType);
					}
				}
				break;
			}
			case Section.Seconds: {
				let newSeconds;
				if (this.secondInput) {
					newSeconds = seconds.isSome() ? Number(`${seconds.value % 10}${digit}`) : digit;
				} else {
					newSeconds = digit;
					this.secondInput = true;
				}
				this.updateStateTime(hours, minutes, some(newSeconds), periodType);
				break;
			}
		}
	}

	private step(amount: number): void {
		const { activeSection } = this.state;
		const { withPeriodType } = this.props;
		const { hours, minutes, seconds, periodType } = this.props.value;
		switch (activeSection) {
			case Section.Hours: {
				if (withPeriodType) {
					this.updateStateTime(add(hours, amount, 12), minutes, seconds, periodType);
				} else {
					this.updateStateTime(add(hours, amount, 23), minutes, seconds, periodType);
				}
				break;
			}
			case Section.Minutes: {
				this.updateStateTime(hours, add(minutes, amount, 59), seconds, periodType);
				break;
			}
			case Section.Seconds: {
				this.updateStateTime(hours, minutes, add(seconds, amount, 59), periodType);
				break;
			}
			case Section.PeriodType: {
				this.updateStateTime(hours, minutes, seconds, togglePeriodType(periodType));
				break;
			}
		}
	}

	private updateStateTime(
		newHours: Option<number>,
		newMinutes: Option<number>,
		newSeconds: Option<number>,
		newPeriodType: Option<string>,
	): void {
		const { onValueChange, value } = this.props;
		const { hours, minutes, seconds, periodType } = value;
		isTimesDifferent(
			{
				hours: newHours,
				minutes: newMinutes,
				seconds: newSeconds,
				periodType: newPeriodType,
			},
			{
				hours,
				minutes,
				seconds,
				periodType,
			},
		) &&
			onValueChange &&
			onValueChange({
				hours: newHours,
				minutes: newMinutes,
				seconds: newSeconds,
				periodType: newPeriodType,
			});
	}

	private correctTime() {
		const { minutes, hours, seconds, periodType } = this.props.value;

		const isMinutesInvalid = minutes.map(min => min >= 60);
		const isSecondsInvalid = seconds.map(sec => sec >= 60);
		if (isMinutesInvalid.toNullable() || isSecondsInvalid.toNullable()) {
			const correctedMinutes = isMinutesInvalid.toNullable() ? some(59) : minutes;
			const correctedSeconds = isSecondsInvalid.toNullable() ? some(59) : seconds;
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
function add(a: Option<number>, b: number, max: number): Option<number> {
	if (a.isNone()) {
		return some(b < 0 ? max : 0);
	} else {
		let result = (a.value + b) % (max + 1);
		if (result < 0) {
			result += max + 1;
		}
		return some(result);
	}
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

function findActiveSectionOnKeyLeft(activeState?: Section, isSecondsExist?: boolean): Section {
	switch (activeState) {
		case Section.PeriodType: {
			return isSecondsExist ? Section.Seconds : Section.Minutes;
		}
		case Section.Seconds: {
			return Section.Minutes;
		}
		case Section.Minutes: {
			return Section.Hours;
		}
		default:
			return Section.Hours;
	}
}

function findActiveSectionOnKeyRight(
	activeSection?: Section,
	isSecondsExist?: boolean,
	isClockFormatExist?: boolean,
): Section {
	switch (activeSection) {
		case Section.Hours: {
			return Section.Minutes;
		}
		case Section.Minutes: {
			if (isSecondsExist) {
				return Section.Seconds;
			} else if (isClockFormatExist) {
				return Section.PeriodType;
			} else {
				return Section.Minutes;
			}
		}
		case Section.Seconds: {
			return isClockFormatExist ? Section.PeriodType : Section.Seconds;
		}
		case Section.PeriodType: {
			return Section.PeriodType;
		}
		default:
			return Section.Hours;
	}
}

function togglePeriodType(periodType: Option<string>): Option<string> {
	const periodTypeNormalized = periodType.getOrElse('am').toLowerCase();
	switch (periodTypeNormalized) {
		case 'am':
			return some('pm');
		case 'pm':
			return some('am');
		default:
			return some('am');
	}
}
