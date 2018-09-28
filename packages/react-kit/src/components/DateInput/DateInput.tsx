import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SteppableInput, TSteppableInputProps, checkParentsUpTo } from '../SteppableInput/SteppableInput';
import { ComponentClass } from 'react';
import { TControlProps, KeyCode, KEY_CODE_NUM_MAP } from '../Control/Control';
import * as classnames from 'classnames';
import { createPortal } from 'react-dom';
import { withTheme } from '../../utils/withTheme';
import { ButtonIcon, TButtonIconProps } from '../ButtonIcon/ButtonIcon';
import * as is_before from 'date-fns/is_before';
import * as is_after from 'date-fns/is_after';
import ReactInstance = React.ReactInstance;
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { PURE } from '../../utils/pure';
import { Popover, TPopoverProps } from '../Popover/Popover';
import { withDefaults } from '../../utils/with-defaults';
import { Option, none, some, getSetoid, option } from 'fp-ts/lib/Option';
import { setoidNumber, getRecordSetoid } from 'fp-ts/lib/Setoid';
import { sequence } from 'fp-ts/lib/Traversable';
import { array } from 'fp-ts/lib/Array';

export type TDate = {
	day: Option<number>,
	month: Option<number>,
	year: Option<number>,
};

export type TDateValueProps = TControlProps<TDate>;

export enum DateFormatType {
	MDY,
	DMY,
}

export type TCalendarProps = TControlProps<Date | null | undefined> & {
	onMouseDown?: React.EventHandler<React.MouseEvent<Element>>;
	min?: Date;
	max?: Date;
};

export type TDateInputOwnProps = TSteppableInputProps &
	TDateValueProps & {
	min?: Date;
	max?: Date;
	calendarIcon?: React.ReactElement<any>;
	onClear?: Function;
	onFocus?: () => void;
	onBlur?: () => void;
	target?: Element;
	Calendar?: React.ComponentClass<TCalendarProps> | React.SFC<TCalendarProps>;
};

export type TDateDefaultProps = {
	SteppableInput: React.ComponentClass<TSteppableInputProps> | React.SFC<TSteppableInputProps>;
	ButtonIcon: React.ComponentClass<TButtonIconProps>;
	Popover: React.ComponentClass<TPopoverProps> | React.SFC<TPopoverProps>;
	dateFormatType: DateFormatType;
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

enum ActiveSection {
	Day,
	Month,
	Year,
}

type TDateInputState = {
	activeSection?: ActiveSection;
	day: Option<number>;
	month: Option<number>;
	year: Option<number>;
	isOpened?: boolean;
};

const setoidOptionNumber = getSetoid(setoidNumber);
const dateObjSetoid = getRecordSetoid<TDate>({ day: setoidOptionNumber, month: setoidOptionNumber, year: setoidOptionNumber });
const isDatesDifferent = (x: TDate, y: TDate): boolean => !dateObjSetoid.equals(x, y);

export const DATE_INPUT = Symbol('DateInput') as symbol;

@PURE
class RawDateInput extends React.Component<TDateInputFullProps, TDateInputState> {
	readonly state: TDateInputState = {
		isOpened: false,
		day: this.props.value.day,
		month: this.props.value.month,
		year: this.props.value.year,
	};
	private secondInput: boolean = false;
	private calendarButtonRef!: ReactInstance;

	componentWillReceiveProps(newProps: TDateInputFullProps) {
		if (isDatesDifferent(this.props.value, newProps.value)) {
			this.setState({
				month: newProps.value.month,
				day: newProps.value.day,
				year: newProps.value.year,
			});
		}
	}

	render() {
		const {
			isDisabled,
			error,
			clearIcon,
			calendarIcon,
			Calendar,
			incrementIcon,
			value,
			decrementIcon,
			theme,
			ButtonIcon,
			SteppableInput,
			dateFormatType,
		} = this.props;
		const { month, day, year, activeSection } = this.state;

		const yearClassName = classnames(theme.section, {
			[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.Year,
		});

		let onClear;
		// check if "X" clear button should be visible - at least one part of date should be set
		if ((value.day.isSome() && value.month.isSome() && value.year.isSome()) || day.isSome() || month.isSome() || year.isSome()) {
			onClear = this.onClear;
		}

		const innerClassName = classnames(theme.inner, {
			[theme.inner_isFilled as string]: value.day.isSome() && value.month.isSome() && value.year.isSome(),
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
				onClick={this.onSteppableInputClick}>
				<div className={innerClassName}>
					{dateFormatType === DateFormatType.DMY && this.renderDay()}
					{dateFormatType === DateFormatType.MDY && this.renderMonth()}
					<span className={theme.separator}>/</span>
					{dateFormatType === DateFormatType.DMY && this.renderMonth()}
					{dateFormatType === DateFormatType.MDY && this.renderDay()}
					<span className={theme.separator}>/</span>
					<span className={yearClassName} onMouseDown={this.onYearMouseDown}>
						{this.format(year, ActiveSection.Year)}
					</span>
				</div>
				{Calendar &&
					calendarIcon && (
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

	private renderDay() {
		const { isDisabled, theme } = this.props;
		const { activeSection, day } = this.state;
		const dayClassName = classnames(theme.section, {
			[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.Day,
		});
		return (
			<span className={dayClassName} onMouseDown={this.onDayMouseDown}>
				{this.format(day, ActiveSection.Day)}
			</span>
		);
	}

	private renderMonth() {
		const { isDisabled, theme } = this.props;
		const { activeSection, month } = this.state;
		const monthClassName = classnames(theme.section, {
			[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.Month,
		});
		return (
			<span className={monthClassName} onMouseDown={this.onMonthMouseDown}>
				{this.format(month, ActiveSection.Month)}
			</span>
		);
	}

	private renderCalendar(): any {
		const { target, Calendar, Popover, value, min, max, theme } = this.props;
		const { isOpened } = this.state;
		if (!Calendar) {
			return null;
		}

		const calendar = (
			<Calendar
				value={value.date}
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

	private format(date: Option<number>, section: ActiveSection): string {
		if (date.isSome()) {
			const value = date.value;
			switch (section) {
				//maybe we should use left-pad here? ;)
				case ActiveSection.Day: //fallthrough
				case ActiveSection.Month: {
					//day and month are 2 digits
					return `${value >= 0 && value < 10 ? 0 : ''}${value}`;
				}
				case ActiveSection.Year: {
					if (value < 10) {
						return `000${value}`;
					} else if (value < 100) {
						return `00${value}`;
					} else if (value < 1000) {
						return `0${value}`;
					} else {
						return `${value}`;
					}
				}
			}
		}
		switch (section) {
			case ActiveSection.Day: {
				return 'dd';
			}
			case ActiveSection.Month: {
				return 'mm';
			}
			case ActiveSection.Year: {
				return 'yyyy';
			}
		}
	}

	private updateStateTime(day: Option<number>, month: Option<number>, year: Option<number>): void {
		const { onValueChange, value, min, max } = this.props;

		const canBuildValue = day.isSome() && month.isSome() && year.isSome();
		const newValueDiffers = isDatesDifferent(value, { day, month, year });

		if (canBuildValue) {
			if (newValueDiffers && onValueChange && day.isSome() && month.isSome() && year.isSome()) {
				const date = new Date(year.value, month.value - 1, day.value);
				//check new date
				const wasAdjusted = !(
					date.getFullYear() === year.value &&
					date.getMonth() === month.value - 1 &&
					date.getDate() === day.value
				);
				const isOutOfBounds = (min && is_before(date, min)) || (max && is_after(date, max));
				if (!wasAdjusted && !isOutOfBounds) {
					//everything is ok and value hasn't been adjusted
					onValueChange({ day, month, year });
				} else {
					//too "smart" Date constructor has adjusted our value - date is actually invalid
					//or date is out of bounds
					onValueChange({ day, month, year });
					this.setState({
						day,
						month,
						year,
					});
				}
			}
		} else {
			onValueChange && onValueChange({ day, month, year });
			this.setState({
				day,
				month,
				year,
			});
		}
	}

	private onIncrement = () => {
		this.secondInput = false;
		const { day, month, year, activeSection } = this.state;
		switch (activeSection) {
			case ActiveSection.Day: {
				//day starts from 1 here and cannot be zero
				const newDay = day.map(value => (value + 1) % 32 || 1).orElse(() => some(1));
				this.updateStateTime(newDay, month, year);
				break;
			}
			case ActiveSection.Month: {
				//month starts from 1 here and cannot be zero
				const newMonth = month.map(value => (value + 1) % 13 || 1).orElse(() => some(1));
				this.updateStateTime(day, newMonth, year);
				break;
			}
			case ActiveSection.Year: {
				const newYear = year.chain(value => {
					if (value !== 9999) {
						return some(value + 1);
					} else {
						return none;
					}
				}).orElse(() => some(new Date().getFullYear()));
				this.updateStateTime(day, month, newYear);
				break;
			}
		}
	};

	private onDecrement = () => {
		this.secondInput = false;
		const { day, month, year, activeSection } = this.state;
		switch (activeSection) {
			case ActiveSection.Day: {
				//day starts from 1 and cannot be zero
				const newDay = day.map(value => (value - 1) % 32 || 31).orElse(() => some(31));
				this.updateStateTime(newDay, month, year);
				break;
			}
			case ActiveSection.Month: {
				//month starts from 1 and cannot be zero
				const newMonth = month.map(value => (value - 1) % 13 || 12).orElse(() => some(12));
				this.updateStateTime(day, newMonth, year);
				break;
			}
			case ActiveSection.Year: {
				const newYear = year.chain(value => {
					if (value !== 0) {
						return some(value - 1);
					} else {
						return none;
					}
				}).orElse(() => some(new Date().getFullYear()));
				this.updateStateTime(day, month, newYear);
				break;
			}
		}
	};

	private onCalendarValueChange = (date: Date | null | undefined) => {
		const { onValueChange, value } = this.props;
		this.setState({
			isOpened: false,
		});
		if (
			onValueChange &&
			date &&
			!isNaN(date.getTime()) &&
			(!value.date ||
				isNaN(value.date.getTime()) ||
				value.date.getFullYear() !== date.getFullYear() ||
				value.date.getMonth() !== date.getMonth() ||
				value.date.getDate() !== date.getDate())
		) {
			onValueChange({ date });
		}
	};

	private onCalendarMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		//stop blur
		e.preventDefault();
	};

	private onClear = () => {
		this.secondInput = false;
		this.updateStateTime(none, none, none);
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
		const { activeSection, day, month, year } = this.state;
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
						this.updateStateTime(none, month, year);
						break;
					}
					case ActiveSection.Month: {
						this.updateStateTime(day, none, year);
						break;
					}
					case ActiveSection.Year: {
						this.updateStateTime(day, month, none);
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
		const { day, month, year } = this.state;
		switch (this.state.activeSection) {
			case ActiveSection.Day: {
				if (this.secondInput) {
					let newDay;
					if (day.isSome() && day.value < 3) {
						newDay = Number(`${day.value}${digit}`);
					} else if (day.isSome() && day.value === 3) {
						newDay = Math.min(Number(`${day.value}${digit}`), 31);
					} else {
						newDay = digit;
					}
					this.updateStateTime(some(newDay), month, year);
					this.selectNextSection();
					this.secondInput = false;
				} else {
					this.updateStateTime(some(digit), month, year);
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
					let newMonth;
					if (month.isSome() && month.value < 1) {
						newMonth = Number(`${month.value}${digit}`);
					} else if (month.isSome() && month.value === 1) {
						newMonth = Math.min(Number(`${month.value}${digit}`), 12);
					} else {
						newMonth = digit;
					}
					this.updateStateTime(day, some(newMonth), year);
					this.selectNextSection();
					this.secondInput = false;
				} else {
					this.updateStateTime(day, some(digit), year);
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
					if (year.isSome()) {
						if (year.value < 1000) {
							this.updateStateTime(day, month, some(Number(`${year.value}${digit}`)));
						} else {
							this.updateStateTime(day, month, some(Number(`${year.value}${digit}`.substr(1))));
						}
					} else {
						this.updateStateTime(day, month, none);
					}
				} else {
					this.updateStateTime(day, month, some(digit));
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

function getValuesFromDate(date: Date) {
	return {
		month: date.getMonth() + 1,
		day: date.getDate(),
		year: date.getFullYear(),
	};
}

function isDefined<A>(value: A | undefined): value is A {
	return typeof value !== 'undefined';
}
