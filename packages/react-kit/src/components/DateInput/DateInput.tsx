import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
	SteppableInput,
	TSteppableInputProps,
	checkParentsUpTo
} from '../SteppableInput/SteppableInput';
import { ComponentClass } from 'react';
import { TControlProps, KeyCode, KEY_CODE_NUM_MAP } from '../Control/Control';
import * as classnames from 'classnames';
import { createPortal } from 'react-dom';
import { withTheme } from '../../utils/withTheme';
import { ButtonIcon, TButtonIconProps } from '../ButtonIcon/ButtonIcon';
import * as is_before from 'date-fns/is_before';
import * as is_after from 'date-fns/is_after';
import ReactInstance = React.ReactInstance;
import { ObjectClean } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { PURE } from '../../utils/pure';
import { Popover } from '../Popover/Popover';

type TDateValueProps = TControlProps<Date | null | undefined>;

export type TCalendarProps = TDateValueProps & {
	onMouseDown?: React.EventHandler<React.MouseEvent<Element>>,
	min?: Date,
	max?: Date
};

type TDateInputOwnProps = TSteppableInputProps & TDateValueProps & {
	min?: Date,
	max?: Date,
	calendarIcon?: React.ComponentClass<any> | React.StatelessComponent<any>,
	onClear?: Function,
	target?: Element
	Calendar?: React.ComponentClass<TCalendarProps> | React.SFC<TCalendarProps>,
};

type TDateDefaultProps = {
	SteppableInput: React.ComponentClass<TSteppableInputProps> | React.SFC<TSteppableInputProps>,
	ButtonIcon: React.ComponentClass<TButtonIconProps>
};

type TDateInputInjectedProps = {
	theme: {
		inner?: string,
		inner_isFilled?: string,
		section?: string,
		section_isActive?: string,
		separator?: string,
		SteppableInput?: TSteppableInputProps['theme'],
		ButtonIcon?: TButtonIconProps['theme'],
		CalendarButtonIcon?: TButtonIconProps['theme']
	}
};

type TDateInputFullProps = TDateInputOwnProps & TDateInputInjectedProps & TDateDefaultProps;

enum ActiveSection {
	Day,
	Month,
	Year
}

type TDateInputState = {
	activeSection?: ActiveSection,
	day?: number,
	month?: number,
	year?: number,
	isOpened?: boolean
};

export const DATE_INPUT = Symbol('DateInput');

@PURE
class RawDateInput extends React.Component<TDateInputFullProps, TDateInputState> {
	static defaultProps = {
		SteppableInput,
		ButtonIcon
	};

	state: TDateInputState = {
		isOpened: false
	};
	private secondInput: boolean = false;
	private calendarButtonRef: ReactInstance;

	componentWillMount() {
		const { value } = this.props;
		if (value) {
			this.setState(getValuesFromDate(value));
		}
	}

	componentWillReceiveProps(newProps: TDateInputFullProps) {
		if (this.props.value !== newProps.value && isDefined(newProps.value)) {
			let month;
			let day;
			let year;
			if (typeof newProps.value !== 'undefined' && newProps.value !== null && !isNaN(newProps.value.getTime())) {
				const result = getValuesFromDate(newProps.value);
				month = result.month;
				day = result.day;
				year = result.year;
			}
			this.setState({
				month,
				day,
				year
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
			SteppableInput
		} = this.props;
		const { month, day, year, activeSection } = this.state;

		const dayClassName = classnames(
			theme.section,
			{
				[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.Day
			}
		);

		const monthClassName = classnames(
			theme.section,
			{
				[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.Month
			}
		);

		const yearClassName = classnames(
			theme.section,
			{
				[theme.section_isActive as string]: !isDisabled && activeSection === ActiveSection.Year
			}
		);

		let onClear;
		if (isDefined(value) && value !== null || isDefined(day) || isDefined(month) || isDefined(year)) {
			onClear = this.onClear;
		}

		const innerClassName = classnames(
			theme.inner,
			{
				[theme.inner_isFilled as string]: value && !isNaN(value.getTime())
			}
		);

		return (
			<SteppableInput isDisabled={isDisabled}
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
					<span className={dayClassName}
					      onMouseDown={this.onDayMouseDown}>
						{this.format(day, ActiveSection.Day)}
					</span>
					<span className={theme.separator}>/</span>
					<span className={monthClassName}
					      onMouseDown={this.onMonthMouseDown}>
						{this.format(month, ActiveSection.Month)}
					</span>
					<span className={theme.separator}>/</span>
					<span className={yearClassName}
					      onMouseDown={this.onYearMouseDown}>
						{this.format(year, ActiveSection.Year)}
					</span>
				</div>
				{Calendar && calendarIcon && (
					<ButtonIcon isFlat={true}
					            ref={(el: any) => this.calendarButtonRef = el}
					            isDisabled={isDisabled}
					            tabIndex={-1}
					            icon={calendarIcon}
					            onMouseDown={this.onCalendarButtonMouseDown}
					            theme={theme.CalendarButtonIcon}/>
				)}
				{this.renderCalendar()}
			</SteppableInput>
		);
	}

	private renderCalendar(): any {
		const { target, Calendar, value, min, max } = this.props;
		const { isOpened } = this.state;
		if (!Calendar) {
			return null;
		}

		const calendar = (
			<Calendar value={value}
			          min={min}
			          max={max}
			          onMouseDown={this.onCalendarMouseDown}
			          onValueChange={this.onCalendarValueChange}/>
		);

		if (target) {
			return createPortal(isOpened ? calendar : null, target);
		} else {
			return (
				<Popover anchor={this}
				         closeOnClickAway={true}
				         onMouseDown={this.onCalendarMouseDown}
				         isOpened={isOpened}>
					{calendar}
				</Popover>
			);
		}
	}

	private format(value: number | undefined, section: ActiveSection): string {
		if (isDefined(value)) {
			switch (section) {
				//maybe we should use left-pad here? ;)
				case ActiveSection.Day: //fallthrough
				case ActiveSection.Month: {
					//day and month are 2 digits
					return `${typeof value !== 'undefined' && value >= 0 && value < 10 ? 0 : ''}${value}`;
				}
				case ActiveSection.Year: //fallthrough
				default: {
					if (typeof value !== 'undefined' && value < 10) {
						return `000${value}`;
					} else if (typeof value !== 'undefined' && value < 100) {
						return `00${value}`;
					} else if (typeof value !== 'undefined' && value < 1000) {
						return `0${value}`;
					} else {
						return `${value}`;
					}
				}
			}
		} else {
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
				default: {
					return '--';
				}
			}
		}
	}

	private updateStateTime(day?: number, month?: number, year?: number): void {
		const { onValueChange, value, min, max } = this.props;

		const canBuildValue = isDefined(day) && isDefined(month) && isDefined(year);
		const newValueDiffers = canBuildValue && typeof month !== 'undefined' &&
			(
				typeof value === 'undefined' ||
				value === null ||
				value.getDate() !== day ||
				value.getMonth() !== month - 1 ||
				value.getFullYear() !== year
			);

		if (canBuildValue) {
			if (newValueDiffers &&
				onValueChange &&
				typeof year !== 'undefined' &&
				typeof month !== 'undefined' &&
				typeof day !== 'undefined') {
				const date = new Date(
					year,
					month - 1,
					day
				);
				//check new date
				const wasAdjusted = !(
					date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
				);
				const isOutOfBounds = min && is_before(date, min) || max && is_after(date, max);
				if (!wasAdjusted && !isOutOfBounds) {
					//everything is ok and value hasn't been adjusted
					onValueChange(date);
				} else {
					//too "smart" Date constructor has adjusted our value - date is actually invalid
					//or date is out of bounds
					onValueChange(undefined);
					this.setState({
						day,
						month,
						year
					});
				}
			}
		} else {
			if (isDefined(this.props.value)) {
				onValueChange && onValueChange(undefined);
			}
			this.setState({
				day,
				month,
				year
			});
		}
	}

	private onIncrement = () => {
		this.secondInput = false;
		const { day, month, year, activeSection } = this.state;
		switch (activeSection) {
			case ActiveSection.Day: {
				//day starts from 1 here and cannot be zero
				const newDay = typeof day !== 'undefined' ? (day + 1) % 32 || 1 : 1;
				this.updateStateTime(newDay, month, year);
				break;
			}
			case ActiveSection.Month: {
				//month starts from 1 here and cannot be zero
				const newMonth = typeof month !== 'undefined' ? (month + 1) % 13 || 1 : 1;
				this.updateStateTime(day, newMonth, year);
				break;
			}
			case ActiveSection.Year: {
				const newYear = typeof year !== 'undefined' && year !== 9999 ? year + 1 : new Date().getFullYear();
				this.updateStateTime(day, month, newYear);
				break;
			}
		}
	}

	private onDecrement = () => {
		this.secondInput = false;
		const { day, month, year, activeSection } = this.state;
		switch (activeSection) {
			case ActiveSection.Day: {
				//day starts from 1 and cannot be zero
				const newDay = typeof day !== 'undefined' ? (day - 1) % 32 || 31 : 31;
				this.updateStateTime(newDay, month, year);
				break;
			}
			case ActiveSection.Month: {
				//month starts from 1 and cannot be zero
				const newMonth = typeof month !== 'undefined' ? (month - 1) % 13 || 12 : 12;
				this.updateStateTime(day, newMonth, year);
				break;
			}
			case ActiveSection.Year: {
				const newYear = typeof year !== 'undefined' && year !== 0 ? year - 1 : new Date().getFullYear();
				this.updateStateTime(day, month, newYear);
				break;
			}
		}
	}

	private onCalendarValueChange = (date: Date) => {
		const { onValueChange, value } = this.props;
		this.setState({
			isOpened: false
		});
		if (onValueChange &&
			date &&
			date && !isNaN(date.getTime()) &&
			(
				!value ||
				isNaN(value.getTime()) ||
				value.getFullYear() !== date.getFullYear() ||
				value.getMonth() !== date.getMonth() ||
				value.getDate() !== date.getDate()
			)
		) {
			onValueChange(date);
		}
	}

	private onCalendarMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		//stop blur
		e.preventDefault();
	}

	private onClear = () => {
		this.secondInput = false;
		this.updateStateTime();
		const { onClear } = this.props;
		onClear && onClear();
	}

	private onCalendarButtonMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (isDefined(this.state.activeSection)) {
			e.preventDefault();
		}
	}

	private onDayMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Day
			});
		}
	}

	private onMonthMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Month
			});
		}
	}

	private onYearMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		if (!this.props.isDisabled) {
			this.setState({
				activeSection: ActiveSection.Year
			});
		}
	}

	private onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		const { activeSection, day, month, year } = this.state;
		switch (e.keyCode) {
			case KeyCode.Escape: {
				if (this.state.isOpened) {
					this.setState({
						isOpened: false
					});
				}
				break;
			}
			case KeyCode.Left: {
				e.preventDefault(); //block h-scrolling
				switch (activeSection) {
					case ActiveSection.Month: {
						this.secondInput = false;
						this.setState({
							activeSection: ActiveSection.Day
						});
						break;
					}
					case ActiveSection.Year: {
						this.secondInput = false;
						this.setState({
							activeSection: ActiveSection.Month
						});
						break;
					}
				}
				break;
			}
			case KeyCode.Right: {
				e.preventDefault(); //block h-scrolling
				switch (activeSection) {
					case ActiveSection.Day: {
						this.secondInput = false;
						this.setState({
							activeSection: ActiveSection.Month
						});
						break;
					}
					case ActiveSection.Month: {
						this.secondInput = false;
						this.setState({
							activeSection: ActiveSection.Year
						});
						break;
					}
				}
				break;
			}
			case KeyCode.Delete: //fallthrough
			case KeyCode.Backspace: {
				this.secondInput = false;
				switch (activeSection) {
					case ActiveSection.Day: {
						this.updateStateTime(undefined, month, year);
						break;
					}
					case ActiveSection.Month: {
						this.updateStateTime(day, undefined, year);
						break;
					}
					case ActiveSection.Year: {
						this.updateStateTime(day, month, undefined);
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
	}

	onSteppableInputClick = (e: React.MouseEvent<HTMLElement>) => {
		if (this.state.isOpened) {
			if (
				checkParentsUpTo(
					e.target as Element,
					ReactDOM.findDOMNode(this.calendarButtonRef),
					ReactDOM.findDOMNode(this)
				)
			) {
				//clicked on calendar button
				this.setState({
					isOpened: false
				});
			} else {
				this.setState({
					isOpened: true
				});
			}
		} else {
			this.setState({
				isOpened: true
			});
		}
	}

	private onBlur = (e: React.FocusEvent<HTMLElement>) => {
		this.secondInput = false;
		this.setState({
			activeSection: undefined,
			isOpened: false
		});
	}

	private onFocus = (e: React.FocusEvent<HTMLElement>) => {
		this.secondInput = false;
		if (!isDefined(this.state.activeSection)) {
			this.setState({
				activeSection: ActiveSection.Day
			});
		}
	}

	private handleDigitKeyDown(digit: number) {
		const { day, month, year } = this.state;
		switch (this.state.activeSection) {
			case ActiveSection.Day: {
				if (this.secondInput) {
					let newDay;
					if (typeof day !== 'undefined' && day < 3) {
						newDay = Number(`${day}${digit}`);
					} else if (day === 3) {
						newDay = Math.min(Number(`${day}${digit}`), 31);
					} else {
						newDay = digit;
					}
					this.updateStateTime(newDay, month, year);
					this.setState({
						activeSection: ActiveSection.Month
					});
					this.secondInput = false;
				} else {
					this.updateStateTime(digit, month, year);
					if (digit > 3) {
						this.setState({
							activeSection: ActiveSection.Month
						});
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
					if (typeof month !== 'undefined' && month < 1) {
						newMonth = Number(`${month}${digit}`);
					} else if (month === 1) {
						newMonth = Math.min(Number(`${month}${digit}`), 12);
					} else {
						newMonth = digit;
					}
					this.updateStateTime(day, newMonth, year);
					this.setState({
						activeSection: ActiveSection.Year
					});
					this.secondInput = false;
				} else {
					this.updateStateTime(day, digit, year);
					if (digit > 1) {
						this.setState({
							activeSection: ActiveSection.Year
						});
						this.secondInput = false;
					} else {
						this.secondInput = true;
					}
				}
				break;
			}
			case ActiveSection.Year: {
				if (this.secondInput) {
					let newYear = `${year}${digit}`;
					if (typeof year !== 'undefined' && year >= 1000) {
						newYear = newYear.substr(1);
					}
					this.updateStateTime(day, month, Number(newYear));
				} else {
					this.updateStateTime(day, month, digit);
					this.secondInput = true;
				}
				break;
			}
		}
	}
}

export type TDateInputProps = ObjectClean<PartialKeys<TDateInputFullProps, 'theme' | 'SteppableInput' | 'ButtonIcon'>>;
export const DateInput: ComponentClass<TDateInputProps> = withTheme(DATE_INPUT)(RawDateInput);

function getValuesFromDate(date: Date) {
	return {
		month: date.getMonth() + 1,
		day: date.getDate(),
		year: date.getFullYear()
	};
}

function isDefined(value: any): boolean {
	return typeof value !== 'undefined';
}