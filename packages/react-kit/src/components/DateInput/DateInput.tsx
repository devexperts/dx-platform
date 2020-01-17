import React from 'react';
import ReactDOM from 'react-dom';
import { ComponentClass } from 'react';
import { createPortal } from 'react-dom';
import { TSteppableInputProps, SteppableInput, checkParentsUpTo } from '../SteppableInput/SteppableInput';
import { KeyCode, KEY_CODE_NUM_MAP, TControlProps } from '../Control/Control';
import classnames from 'classnames';
import { withTheme } from '../../utils/withTheme';
import { ButtonIcon, TButtonIconProps } from '../ButtonIcon/ButtonIcon';
import ReactInstance = React.ReactInstance;
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { PURE } from '../../utils/pure';
import { Popover, TPopoverProps } from '../Popover/Popover';
import { withDefaults } from '../../utils/with-defaults';
import { Option, none, some, isSome, map, toNullable, alt, chain } from 'fp-ts/lib/Option';
import {
	TDateInputState,
	ActiveSection,
	DateFormatType,
	isDatesDifferent,
	toObjectDate,
	format,
	buildDateOption,
	decrementMonthOption,
	incrementMonthOption,
	TDateInputValue,
	inc,
} from './DateInput.model';
import { ReactRef } from '../../utils/typings';
import { pipe } from 'fp-ts/lib/pipeable';

export const DATE_INPUT = Symbol('DateInput') as symbol;

export type TCalendarProps = TControlProps<Date | null> & {
	onMouseDown?: React.EventHandler<React.MouseEvent<Element>>;
	min?: Date;
	max?: Date;
};

type TDateValueProps = TControlProps<TDateInputValue>;

export type TDateInputOwnProps = TSteppableInputProps &
	TDateValueProps & {
		min?: Date;
		max?: Date;
		calendarIcon?: React.ReactElement<any>;
		onClear?: Function;
		onFocus?: () => void;
		onBlur?: () => void;
		onMouseEnter?: () => void;
		onMouseLeave?: () => void;
		target?: Element;
		Calendar?: ComponentClass<TCalendarProps> | React.SFC<TCalendarProps>;
	};

type TDateDefaultProps = {
	SteppableInput: ComponentClass<TSteppableInputProps> | React.SFC<TSteppableInputProps>;
	ButtonIcon: ComponentClass<TButtonIconProps>;
	Popover: ComponentClass<TPopoverProps> | React.SFC<TPopoverProps>;
	dateFormatType: DateFormatType;
	innerRef?: (instance: ReactRef) => void;
};

export type TDateInputInjectedProps = {
	theme: {
		inner?: string;
		inner_isFilled?: string;
		section?: string;
		section_isActive?: string;
		separator?: string;
		SteppableInput?: TSteppableInputProps['theme'];
		ButtonIcon?: TButtonIconProps['theme'];
		CalendarButtonIcon?: TButtonIconProps['theme'];
		Popover?: TPopoverProps['theme'];
	};
};

export type TDateInputFullProps = TDateInputOwnProps & TDateInputInjectedProps & TDateDefaultProps;

@PURE
class RawDateInput extends React.Component<TDateInputFullProps, TDateInputState> {
	readonly state: TDateInputState = {
		isOpened: false,
	};
	private secondInput: boolean = false;
	private calendarButtonRef!: ReactInstance;

	render() {
		const {
			isDisabled,
			error,
			clearIcon,
			calendarIcon,
			Calendar,
			incrementIcon,
			decrementIcon,
			theme,
			ButtonIcon,
			SteppableInput,
			dateFormatType,
			value: { day, month, year },
		} = this.props;

		const yearClassName = this.getSectionClassName(ActiveSection.Year);

		// check if "X" clear button should be visible - at least one part of date should be set
		const onClear = isSome(day) || isSome(month) || isSome(year) ? this.onClear : undefined;

		const innerClassName = classnames(theme.inner, {
			[theme.inner_isFilled as string]: isSome(day) && isSome(month) && isSome(year),
		});

		return (
			<SteppableInput
				isDisabled={isDisabled}
				theme={theme.SteppableInput}
				onClear={onClear}
				error={error}
				decrementIcon={decrementIcon}
				incrementIcon={incrementIcon}
				clearIcon={clearIcon}
				onIncrement={this.onIncrement}
				onDecrement={this.onDecrement}
				onBlur={this.onBlur}
				onFocus={this.onFocus}
				onKeyDown={this.onKeyDown}
				onClick={this.onSteppableInputClick}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				innerRef={this.props.innerRef}>
				<div className={innerClassName}>
					{dateFormatType === DateFormatType.DMY && this.renderDay()}
					{dateFormatType === DateFormatType.MDY && this.renderMonth()}
					<span className={theme.separator}>/</span>
					{dateFormatType === DateFormatType.DMY && this.renderMonth()}
					{dateFormatType === DateFormatType.MDY && this.renderDay()}
					<span className={theme.separator}>/</span>
					<span className={yearClassName} onMouseDown={this.onYearMouseDown}>
						{format(year, ActiveSection.Year)}
					</span>
				</div>
				{Calendar && calendarIcon && (
					<ButtonIcon
						isFlat={true}
						ref={(el: any) => (this.calendarButtonRef = el)}
						isDisabled={isDisabled}
						tabIndex={-1}
						icon={calendarIcon}
						onMouseDown={this.onCalendarButtonMouseDown}
						theme={theme.CalendarButtonIcon}
					/>
				)}
				{this.renderCalendar()}
			</SteppableInput>
		);
	}

	private getSectionClassName = (activeSection: ActiveSection): string => {
		const { theme, isDisabled } = this.props;
		const { activeSection: selectedActiveSection } = this.state;

		return classnames(theme.section, {
			[theme.section_isActive as string]: !isDisabled && selectedActiveSection === activeSection,
		});
	};

	private renderDay() {
		const {
			value: { day },
		} = this.props;
		const dayClassName = this.getSectionClassName(ActiveSection.Day);
		return (
			<span className={dayClassName} onMouseDown={this.onDayMouseDown}>
				{format(day, ActiveSection.Day)}
			</span>
		);
	}

	private renderMonth() {
		const {
			value: { month },
		} = this.props;
		const monthClassName = this.getSectionClassName(ActiveSection.Month);
		const monthValue = map(inc)(month);

		return (
			<span className={monthClassName} onMouseDown={this.onMonthMouseDown}>
				{format(monthValue, ActiveSection.Month)}
			</span>
		);
	}

	private renderCalendar(): React.ReactNode {
		const {
			target,
			Calendar,
			Popover,
			value: { day, month, year },
			min,
			max,
			theme,
		} = this.props;
		const { isOpened } = this.state;
		if (!Calendar) {
			return null;
		}

		const date = buildDateOption(day)(month)(year);

		const calendar = (
			<Calendar
				value={toNullable(date)}
				min={min}
				max={max}
				onMouseDown={this.onCalendarMouseDown}
				onValueChange={this.onCalendarValueChange}
			/>
		);

		if (target) {
			return createPortal(isOpened ? calendar : null, target);
		} else {
			return (
				<Popover
					theme={theme.Popover}
					anchor={this}
					closeOnClickAway={true}
					onMouseDown={this.onCalendarMouseDown}
					isOpened={isOpened}>
					{calendar}
				</Popover>
			);
		}
	}

	private onValueChange(day: Option<number>, month: Option<number>, year: Option<number>): void {
		const { onValueChange, value } = this.props;

		isDatesDifferent(value, { day, month, year }) && onValueChange && onValueChange({ day, month, year });
	}

	private onIncrement = () => {
		this.secondInput = false;
		const {
			value: { day, month, year },
		} = this.props;
		const { activeSection } = this.state;
		switch (activeSection) {
			case ActiveSection.Day: {
				//day starts from 1 here and cannot be zero
				const newDay = pipe(
					day,
					map(value => (value + 1) % 32 || 1),
					alt(() => some(1)),
				);
				this.onValueChange(newDay, month, year);
				break;
			}
			case ActiveSection.Month: {
				//month starts from 1 here and cannot be zero
				const newMonth = incrementMonthOption(month);
				this.onValueChange(day, newMonth, year);
				break;
			}
			case ActiveSection.Year: {
				const newYear = pipe(
					year,
					chain(value => {
						if (value !== 9999) {
							return some(value + 1);
						} else {
							return none;
						}
					}),
					alt(() => some(new Date().getFullYear())),
				);
				this.onValueChange(day, month, newYear);
				break;
			}
		}
	};

	private onDecrement = () => {
		this.secondInput = false;
		const {
			value: { day, month, year },
		} = this.props;
		const { activeSection } = this.state;
		switch (activeSection) {
			case ActiveSection.Day: {
				//day starts from 1 and cannot be zero
				const newDay = pipe(
					day,
					map(value => (value - 1) % 32 || 31),
					alt(() => some(31)),
				);
				this.onValueChange(newDay, month, year);
				break;
			}
			case ActiveSection.Month: {
				//month starts from 1 and cannot be zero
				const newMonth = decrementMonthOption(month);
				this.onValueChange(day, newMonth, year);
				break;
			}
			case ActiveSection.Year: {
				const newYear = pipe(
					year,
					chain(value => {
						if (value !== 0) {
							return some(value - 1);
						} else {
							return none;
						}
					}),
					alt(() => some(new Date().getFullYear())),
				);
				this.onValueChange(day, month, newYear);
				break;
			}
		}
	};

	private onCalendarValueChange = (date: Date | null) => {
		const { onValueChange, value } = this.props;
		this.setState({
			isOpened: false,
		});
		if (date) {
			const selectedDate = toObjectDate(date);
			if (isDatesDifferent(value, selectedDate) && onValueChange) {
				onValueChange({
					day: selectedDate.day,
					month: selectedDate.month,
					year: selectedDate.year,
				});
			}
		}
	};

	private onCalendarMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		//stop blur
		e.preventDefault();
	};

	private onClear = () => {
		this.secondInput = false;
		this.onValueChange(none, none, none);
		const { onClear } = this.props;
		onClear && onClear();
	};

	private onCalendarButtonMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (isDefined(this.state.activeSection)) {
			e.preventDefault();
		}
	};

	private onDayMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Day,
			});
		}
	};

	private onMonthMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Month,
			});
		}
	};

	private onYearMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Year,
			});
		}
	};

	private onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		const {
			value: { day, month, year },
		} = this.props;
		const { activeSection } = this.state;
		switch (e.keyCode) {
			case KeyCode.Escape: {
				if (this.state.isOpened) {
					this.setState({
						isOpened: false,
					});
				}
				break;
			}
			case KeyCode.Left: {
				e.preventDefault(); //block h-scrolling
				switch (activeSection) {
					case ActiveSection.Month: //fallthrough
					case ActiveSection.Year: {
						this.secondInput = false;
						break;
					}
				}
				this.selectPreviousSection();
				break;
			}
			case KeyCode.Right: {
				e.preventDefault(); //block h-scrolling
				switch (activeSection) {
					case ActiveSection.Day: //fallthrough
					case ActiveSection.Month: {
						this.secondInput = false;
						break;
					}
				}
				this.selectNextSection();
				break;
			}
			case KeyCode.Delete: //fallthrough
			case KeyCode.Backspace: {
				this.secondInput = false;
				switch (activeSection) {
					case ActiveSection.Day: {
						this.onValueChange(none, month, year);
						break;
					}
					case ActiveSection.Month: {
						this.onValueChange(day, none, year);
						break;
					}
					case ActiveSection.Year: {
						this.onValueChange(day, month, none);
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

	onSteppableInputClick = (e: React.MouseEvent<HTMLElement>) => {
		if (this.state.isOpened) {
			const calendarButtonDOMNode = ReactDOM.findDOMNode(this.calendarButtonRef);
			const thisNode = ReactDOM.findDOMNode(this);
			if (
				calendarButtonDOMNode === null ||
				calendarButtonDOMNode instanceof Text ||
				thisNode === null ||
				thisNode instanceof Text
			) {
				return;
			}
			if (checkParentsUpTo(e.target as Element, calendarButtonDOMNode, thisNode)) {
				//clicked on calendar button
				this.setState({
					isOpened: false,
				});
			} else {
				this.setState({
					isOpened: true,
				});
			}
		} else {
			this.setState({
				isOpened: true,
			});
		}
	};

	private onBlur = (e: React.FocusEvent<HTMLElement>) => {
		this.secondInput = false;
		this.setState({
			activeSection: undefined,
			isOpened: false,
		});
		this.props.onBlur && this.props.onBlur();
	};

	private onFocus = (e: React.FocusEvent<HTMLElement>) => {
		this.secondInput = false;
		if (!isDefined(this.state.activeSection)) {
			this.setState({
				activeSection: this.getDefaultActiveSection(this.props.dateFormatType),
			});
		}
		this.props.onFocus && this.props.onFocus();
	};

	private onMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
		this.props.onMouseEnter && this.props.onMouseEnter();
	};

	private onMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
		this.props.onMouseLeave && this.props.onMouseLeave();
	};

	private getDefaultActiveSection(dateFormatType: DateFormatType): ActiveSection {
		switch (dateFormatType) {
			case DateFormatType.DMY: {
				return ActiveSection.Day;
			}
			case DateFormatType.MDY: {
				return ActiveSection.Month;
			}
		}
	}
	private selectNextSection(): void {
		const { activeSection } = this.state;
		const { dateFormatType } = this.props;
		switch (activeSection) {
			case ActiveSection.Day: {
				switch (dateFormatType) {
					case DateFormatType.DMY: {
						this.setState({
							activeSection: ActiveSection.Month,
						});
						break;
					}
					case DateFormatType.MDY: {
						this.setState({
							activeSection: ActiveSection.Year,
						});
						break;
					}
				}
				break;
			}
			case ActiveSection.Month: {
				switch (dateFormatType) {
					case DateFormatType.DMY: {
						this.setState({
							activeSection: ActiveSection.Year,
						});
						break;
					}
					case DateFormatType.MDY: {
						this.setState({
							activeSection: ActiveSection.Day,
						});
						break;
					}
				}
				break;
			}
		}
	}
	private selectPreviousSection(): void {
		const { activeSection } = this.state;
		const { dateFormatType } = this.props;
		switch (activeSection) {
			case ActiveSection.Day: {
				switch (dateFormatType) {
					case DateFormatType.MDY: {
						this.setState({
							activeSection: ActiveSection.Month,
						});
						break;
					}
				}
				break;
			}
			case ActiveSection.Month: {
				switch (dateFormatType) {
					case DateFormatType.DMY: {
						this.setState({
							activeSection: ActiveSection.Day,
						});
						break;
					}
				}
				break;
			}
			case ActiveSection.Year: {
				switch (dateFormatType) {
					case DateFormatType.DMY: {
						this.setState({
							activeSection: ActiveSection.Month,
						});
						break;
					}
					case DateFormatType.MDY: {
						this.setState({
							activeSection: ActiveSection.Day,
						});
						break;
					}
				}
				break;
			}
		}
	}

	private handleDigitKeyDown(digit: number) {
		const {
			value: { day, month, year },
		} = this.props;
		switch (this.state.activeSection) {
			case ActiveSection.Day: {
				if (this.secondInput) {
					const newDay = pipe(
						day,
						map(value => {
							const dayValue = Number(`${value}${digit}`);
							if (value < 3) {
								return dayValue;
							} else if (value === 3) {
								return Math.min(dayValue, 31);
							} else {
								return digit;
							}
						}),
					);
					this.onValueChange(newDay, month, year);
					this.selectNextSection();
					this.secondInput = false;
				} else {
					this.onValueChange(some(digit), month, year);
					if (digit > 3) {
						this.selectNextSection();
						this.secondInput = false;
					} else {
						this.secondInput = true;
					}
				}
				break;
			}
			case ActiveSection.Month: {
				if (this.secondInput) {
					const newMonth = pipe(
						month,
						map(value => {
							const correctedMonth = value + 1;
							const monthValue = Number(`${correctedMonth}${digit}`) - 1;
							if (correctedMonth < 1) {
								return monthValue;
							} else if (correctedMonth === 1) {
								return Math.min(monthValue, 11);
							} else {
								return digit;
							}
						}),
					);
					this.onValueChange(day, newMonth, year);
					this.selectNextSection();
					this.secondInput = false;
				} else {
					this.onValueChange(day, some(digit - 1), year);
					if (digit > 1) {
						this.selectNextSection();
						this.secondInput = false;
					} else {
						this.secondInput = true;
					}
				}
				break;
			}
			case ActiveSection.Year: {
				if (this.secondInput) {
					const newYear = pipe(
						year,
						map(value => {
							if (value < 1000) {
								return Number(`${value}${digit}`);
							} else {
								return Number(`${value}${digit}`.substr(1));
							}
						}),
					);
					this.onValueChange(day, month, newYear);
				} else {
					this.onValueChange(day, month, some(digit));
					this.secondInput = true;
				}
				break;
			}
		}
	}
}

export type TDateInputProps = PartialKeys<
	TDateInputFullProps,
	'theme' | 'SteppableInput' | 'ButtonIcon' | 'dateFormatType' | 'Popover'
>;
export const DateInput: ComponentClass<TDateInputProps> = withTheme(DATE_INPUT)(
	withDefaults<TDateInputFullProps, 'SteppableInput' | 'ButtonIcon' | 'dateFormatType' | 'Popover'>({
		SteppableInput,
		ButtonIcon,
		Popover,
		dateFormatType: DateFormatType.DMY,
	})(RawDateInput),
);

function isDefined<A>(value: A | undefined): value is A {
	return typeof value !== 'undefined';
}
