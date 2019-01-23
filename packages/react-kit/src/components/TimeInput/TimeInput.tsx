import * as React from 'react';
import { ComponentClass, Fragment } from 'react';
import { PURE } from '../../utils/pure';
import { KEY_CODE_LETR_MAP, KEY_CODE_NUM_MAP, KeyCode, TControlProps } from '../Control/Control';
import * as classnames from 'classnames';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { SteppableInput, TSteppableInputProps } from '../SteppableInput/SteppableInput';
import { withDefaults } from '../../utils/with-defaults';
import { none, Option, some } from 'fp-ts/lib/Option';
import {
	EMPTY_SECTION,
	formatValue,
	isTimesDifferent,
	MAX_VALID_HOURS_FOR_12H_FORMAT,
	MAX_VALID_HOURS_FOR_24H_FORMAT,
	MAX_VALID_MINS_AND_SEC,
	PeriodType,
	Section,
	TTimeInputValue,
} from './TimeInput.model';

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

		const onClear = hours.isSome() || minutes.isSome() ? this.onClear : undefined;
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
						{this.renderSection(hours, Section.Hours)}
					</span>
					<span className={theme.separator}>:</span>
					<span className={this.getSectionClassName(Section.Minutes)} onMouseDown={this.onMinutesMouseDown}>
						{this.renderSection(minutes, Section.Minutes)}
					</span>
					{withSeconds && (
						<Fragment>
							<span className={theme.separator}>:</span>
							<span
								className={this.getSectionClassName(Section.Seconds)}
								onMouseDown={this.onSecondsMouseDown}>
								{this.renderSection(seconds, Section.Seconds)}
							</span>
						</Fragment>
					)}
					{withPeriodType && (
						<Fragment>
							&nbsp;
							<span
								className={this.getSectionClassName(Section.PeriodType)}
								onMouseDown={this.onPeriodTypeMouseDown}>
								{this.renderSection(periodType, Section.PeriodType)}
							</span>
						</Fragment>
					)}
				</div>
			</SteppableInput>
		);
	}

	private renderSection(time: Option<number>, section: Section): string {
		return time.fold(EMPTY_SECTION, value => {
			return formatValue(value, section);
		});
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
			this.correctTimeAndUpdate();
		}
	};

	private onMinutesMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: Section.Minutes,
			});
			this.secondInput = false;
			this.correctTimeAndUpdate();
		}
	};

	private onSecondsMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: Section.Seconds,
			});
			this.secondInput = false;
			this.correctTimeAndUpdate();
		}
	};

	private onPeriodTypeMouseDown = (e: React.MouseEvent<HTMLElement>) => {
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
				if (this.secondInput && hours.isSome()) {
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
						newMinutes = minutes.isSome() ? Number(`${minutes.value % 10}${digit}`) : digit;
					} else {
						newMinutes = digit;
						this.secondInput = true;
					}
					this.updateTime(hours, some(newMinutes), seconds, periodType);
				} else {
					if (this.secondInput && minutes.isSome()) {
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
					newSeconds = seconds.isSome() ? Number(`${seconds.value % 10}${digit}`) : digit;
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

		const isMinutesInvalid = minutes.map(min => min > MAX_VALID_MINS_AND_SEC);
		const isSecondsInvalid = seconds.map(sec => sec > MAX_VALID_MINS_AND_SEC);
		if (isMinutesInvalid.toNullable() || isSecondsInvalid.toNullable()) {
			const correctedMinutes = isMinutesInvalid.toNullable() ? some(MAX_VALID_MINS_AND_SEC) : minutes;
			const correctedSeconds = isSecondsInvalid.toNullable() ? some(MAX_VALID_MINS_AND_SEC) : seconds;
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

/**
 * Values can be zeros (start from 0). Max is included value.
 */
function add(a: Option<number>, b: number, max: number): Option<number> {
	return a
		.map(a => {
			const rawResult = (a + b) % (max + 1);
			return rawResult < 0 ? rawResult + max + 1 : rawResult;
		})
		.alt(some(b < 0 ? max : 0));
}

function isDefined<A>(value?: A): value is A {
	return typeof value !== 'undefined';
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

function togglePeriodType(periodType: Option<PeriodType>): Option<PeriodType> {
	const periodTypeNormalized = periodType.getOrElse(PeriodType.AM);
	switch (periodTypeNormalized) {
		case PeriodType.AM:
			return some(PeriodType.PM);
		case PeriodType.PM:
			return some(PeriodType.AM);
	}
}
