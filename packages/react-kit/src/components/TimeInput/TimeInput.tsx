import React from 'react';
import { ComponentClass, Fragment } from 'react';
import { PURE } from '../../utils/pure';
import { KEY_CODE_LETR_MAP, KEY_CODE_NUM_MAP, KeyCode, TControlProps } from '../Control/Control';
import classnames from 'classnames';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { SteppableInput, TSteppableInputProps } from '../SteppableInput/SteppableInput';
import { withDefaults } from '../../utils/with-defaults';
import { none, Option, some, isSome, map, toNullable } from 'fp-ts/lib/Option';
import {
	add,
	findActiveSectionOnKeyLeft,
	findActiveSectionOnKeyRight,
	formatNumericValue,
	formatTimePeriod,
	isDefined,
	isTimesDifferent,
	togglePeriodType,
	renderSection,
	MAX_VALID_HOURS_FOR_12H_FORMAT,
	MAX_VALID_HOURS_FOR_24H_FORMAT,
	MAX_VALID_MINS_AND_SEC,
	PeriodType,
	Section,
	TTimeInputValue,
} from './TimeInput.model';
import { pipe } from 'fp-ts/lib/pipeable';

export const TIME_INPUT = Symbol('TimeInput') as symbol;

type TTimeInputConfig = {
	withSeconds?: boolean;
	withPeriodType?: boolean;
};

export type TTimeInputOwnProps = TTimeInputConfig & TSteppableInputProps & TControlProps<TTimeInputValue>;

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

type TTimeInputState = {
	activeSection?: Section;
};

@PURE
class RawTimeInput extends React.Component<TTimeInputFullProps, TTimeInputState> {
	readonly state: TTimeInputState = {};
	// Helper, which helps to detect order of input in the two-digit field;
	private secondInput: boolean = false;

	render() {
		const { theme, decrementIcon, incrementIcon, isDisabled, clearIcon, error, value, SteppableInput } = this.props;
		const { hours, minutes, seconds, periodType } = value;
		const { withSeconds, withPeriodType } = this.props;

		const onClear = isSome(hours) || isSome(minutes) ? this.onClear : undefined;
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
				<div className={theme.inner}>
					<span className={this.getSectionClassName(Section.Hours)} onMouseDown={this.onHoursMouseDown}>
						{renderSection(pipe(hours, map(formatNumericValue)))}
					</span>
					<span className={theme.separator}>:</span>
					<span className={this.getSectionClassName(Section.Minutes)} onMouseDown={this.onMinutesMouseDown}>
						{renderSection(pipe(minutes, map(formatNumericValue)))}
					</span>
					{withSeconds && (
						<Fragment>
							<span className={theme.separator}>:</span>
							<span
								className={this.getSectionClassName(Section.Seconds)}
								onMouseDown={this.onSecondsMouseDown}>
								{renderSection(pipe(seconds, map(formatNumericValue)))}
							</span>
						</Fragment>
					)}
					{withPeriodType && (
						<Fragment>
							&nbsp;
							<span
								className={this.getSectionClassName(Section.PeriodType)}
								onMouseDown={this.onPeriodTypeMouseDown}>
								{renderSection(pipe(periodType, map(formatTimePeriod)))}
							</span>
						</Fragment>
					)}
				</div>
			</SteppableInput>
		);
	}

	private getSectionClassName = (section: Section): string => {
		const { theme, isDisabled } = this.props;
		const { activeSection } = this.state;

		return classnames(theme.section, {
			[theme.section_isActive as string]: !isDisabled && activeSection === section,
		});
	};

	private onHoursMouseDown = () => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: Section.Hours,
			});
			this.secondInput = false;
			this.correctTimeAndUpdate();
		}
	};

	private onMinutesMouseDown = () => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: Section.Minutes,
			});
			this.secondInput = false;
			this.correctTimeAndUpdate();
		}
	};

	private onSecondsMouseDown = () => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: Section.Seconds,
			});
			this.secondInput = false;
			this.correctTimeAndUpdate();
		}
	};

	private onPeriodTypeMouseDown = () => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: Section.PeriodType,
			});
			this.secondInput = false;
			this.correctTimeAndUpdate();
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
		this.updateTime(none, none, none, none);
	};

	private onFocus = () => {
		this.secondInput = false;
		if (!isDefined(this.state.activeSection)) {
			this.setState({
				activeSection: Section.Hours,
			});
		}
	};

	private onBlur = () => {
		this.secondInput = false;
		this.correctTimeAndUpdate();
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
				this.correctTimeAndUpdate();
				this.setState({
					activeSection: findActiveSectionOnKeyLeft(activeSection, withSeconds),
				});
				break;
			}
			case KeyCode.Right: {
				e.preventDefault(); //block h-scrolling
				this.secondInput = false;
				this.correctTimeAndUpdate();
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
						this.updateTime(none, minutes, seconds, periodType);
						break;
					}
					case Section.Minutes: {
						this.updateTime(hours, none, seconds, periodType);
						break;
					}
					case Section.Seconds: {
						this.updateTime(hours, minutes, none, periodType);
						break;
					}
				}
				break;
			}
			default: {
				const keyCode = e.keyCode;
				const number = KEY_CODE_NUM_MAP[keyCode];
				const letter = KEY_CODE_LETR_MAP[keyCode];
				if (isDefined(number)) {
					this.handleDigitKeyDown(number);
				} else if (isDefined(letter)) {
					this.handleLetterKeyDown(letter);
				}
			}
		}
	};

	private handleLetterKeyDown(letter: string) {
		const { hours, minutes, seconds } = this.props.value;
		const { activeSection } = this.state;
		if (activeSection === Section.PeriodType) {
			if (letter === KEY_CODE_LETR_MAP[KeyCode.LETR_A]) {
				this.updateTime(hours, minutes, seconds, some(PeriodType.AM));
			} else if (letter === KEY_CODE_LETR_MAP[KeyCode.LETR_P]) {
				this.updateTime(hours, minutes, seconds, some(PeriodType.PM));
			}
		}
	}

	private handleDigitKeyDown(digit: number) {
		const { activeSection } = this.state;
		const { withPeriodType = false, withSeconds = false } = this.props;
		const { hours, minutes, seconds, periodType } = this.props.value;

		switch (activeSection) {
			case Section.Hours: {
				if (this.secondInput && isSome(hours)) {
					let newHours;
					if (!withPeriodType) {
						if (hours.value < 2) {
							newHours = Number(`${hours.value}${digit}`);
						} else if (hours.value === 2) {
							newHours = Math.min(Number(`${hours.value}${digit}`), MAX_VALID_HOURS_FOR_24H_FORMAT);
						} else {
							newHours = digit;
						}
						this.updateTime(some(newHours), minutes, seconds, periodType);
						this.setState({
							activeSection: Section.Minutes,
						});
						this.secondInput = false;
					} else {
						if (hours.value < 2) {
							newHours = Math.min(Number(`${hours.value}${digit}`), MAX_VALID_HOURS_FOR_12H_FORMAT);
						} else {
							newHours = digit;
						}
						this.updateTime(some(newHours), minutes, seconds, periodType);
						this.setState({
							activeSection: Section.Minutes,
						});
						this.secondInput = false;
					}
				} else {
					this.updateTime(some(digit), minutes, seconds, periodType);
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
						newMinutes = isSome(minutes) ? Number(`${minutes.value % 10}${digit}`) : digit;
					} else {
						newMinutes = digit;
						this.secondInput = true;
					}
					this.updateTime(hours, some(newMinutes), seconds, periodType);
				} else {
					if (this.secondInput && isSome(minutes)) {
						const newMinutes = Number(`${minutes.value}${digit}`);
						this.updateTime(hours, some(newMinutes), seconds, periodType);
						if (withSeconds) {
							this.setState({
								activeSection: Section.Seconds,
							});
						} else if (withPeriodType) {
							this.setState({
								activeSection: Section.PeriodType,
							});
						}
						this.updateTime(hours, some(newMinutes), seconds, periodType);
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
						this.updateTime(hours, some(newMinutes), seconds, periodType);
					}
				}
				break;
			}
			case Section.Seconds: {
				let newSeconds;
				if (this.secondInput) {
					newSeconds = isSome(seconds) ? Number(`${seconds.value % 10}${digit}`) : digit;
				} else {
					newSeconds = digit;
					this.secondInput = true;
				}
				this.updateTime(hours, minutes, some(newSeconds), periodType);
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
					this.updateTime(add(hours, amount, MAX_VALID_HOURS_FOR_12H_FORMAT), minutes, seconds, periodType);
				} else {
					this.updateTime(add(hours, amount, MAX_VALID_HOURS_FOR_24H_FORMAT), minutes, seconds, periodType);
				}
				break;
			}
			case Section.Minutes: {
				this.updateTime(hours, add(minutes, amount, MAX_VALID_MINS_AND_SEC), seconds, periodType);
				break;
			}
			case Section.Seconds: {
				this.updateTime(hours, minutes, add(seconds, amount, MAX_VALID_MINS_AND_SEC), periodType);
				break;
			}
			case Section.PeriodType: {
				this.updateTime(hours, minutes, seconds, togglePeriodType(periodType));
				break;
			}
		}
	}

	private updateTime(
		newHours: Option<number>,
		newMinutes: Option<number>,
		newSeconds: Option<number>,
		newPeriodType: Option<PeriodType>,
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

	private correctTimeAndUpdate() {
		const { minutes, hours, seconds, periodType } = this.props.value;

		const isMinutesInvalid = pipe(
			minutes,
			map(min => min > MAX_VALID_MINS_AND_SEC),
		);
		const isSecondsInvalid = pipe(
			seconds,
			map(sec => sec > MAX_VALID_MINS_AND_SEC),
		);
		if (toNullable(isMinutesInvalid) || toNullable(isSecondsInvalid)) {
			const correctedMinutes = toNullable(isMinutesInvalid) ? some(MAX_VALID_MINS_AND_SEC) : minutes;
			const correctedSeconds = toNullable(isSecondsInvalid) ? some(MAX_VALID_MINS_AND_SEC) : seconds;
			this.updateTime(hours, correctedMinutes, correctedSeconds, periodType);
		}
	}
}

export type TTimeInputProps = PartialKeys<TTimeInputFullProps, 'theme' | 'SteppableInput'>;
export const TimeInput: ComponentClass<TTimeInputProps> = withTheme(TIME_INPUT)(
	withDefaults<TTimeInputFullProps, 'SteppableInput'>({
		SteppableInput,
	})(RawTimeInput),
);
