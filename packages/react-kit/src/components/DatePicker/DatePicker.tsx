import * as React from 'react';
import * as moment from 'moment';
import { ComponentClass } from 'react';
import { withTheme } from '../../utils/withTheme';
import { ObjectClean } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { Calendar, TCalendarProps } from '../Calendar/Calendar';
import { isDateValid } from '../../utils/date';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Popover } from '../Popover/Popover';
import { DatePickerDateInput } from './fields/DateInput';
import { Moment } from 'moment';

export const DATE_PICKER = Symbol('DATE_PICKER');

type TFullDatePickerProps = {
	value: string,
	onValueChange: any,
	fieldDateFormat: string,
	headerDateFormat: string,
	headerDayFormat: string,
	dayFormat: string,
	min: string,
	max: string,

	openCalendarIcon: React.ComponentClass<any> | React.StatelessComponent<any>,
	previousMonthIcon: React.ComponentClass<any> | React.StatelessComponent<any>,
	nextMonthIcon: React.ComponentClass<any> | React.StatelessComponent<any>,

	withField: boolean,
	fieldComponent: any,
	placeholder: string,
	isDisabled: boolean,
	locale: string,

	theme: {
		container?: string,
		field?: string,
		field_invalid?: string,
		openCalendar?: string,
		openCalendar__icon?: string,
		popover__container?: string,
		popover__content?: string
	},
	calendarTheme: TCalendarProps['theme'],
}

type TDatePickerState = {
	isOpened: boolean
}

class RawDatePicker extends React.Component<TFullDatePickerProps, TDatePickerState> {

	static defaultProps = {
		value: moment().format(),
		min: '',
		max: '',
		fieldDateFormat: 'MM/DD/YYYY',
		headerDateFormat: 'MMM YYYY',
		dayFormat: 'D',
		headerDayFormat: 'ddd',
		locale: 'en',
		withField: true,
		fieldComponent: DatePickerDateInput,
		isDisabled: false,
		placeholder: ''
	}

	state: TDatePickerState = {
		isOpened: false
	};

	private _anchor: any;

	render() {
		const {
			theme,
			calendarTheme,
			openCalendarIcon,
			isDisabled,
			fieldDateFormat,
			headerDateFormat,
			headerDayFormat,
			dayFormat,
			placeholder,
			value,
			min,
			max,
			fieldComponent: Field,
			previousMonthIcon,
			nextMonthIcon,
			locale,
			withField
		} = this.props;

		const isInvalid = !isDateValid(moment(this.props.value), this.props.min, this.props.max);

		const openCalendarBtnTheme = {
			container: theme.openCalendar,
			icon: theme.openCalendar__icon
		};
		const popoverTheme = {
			container: theme.popover__container,
			content: theme.popover__content
		};

		return (
			<div className={theme.container} ref={el => this._anchor = el}>
				{withField && (
					<Field value={moment(value).locale(locale)}
					       dateFormat={fieldDateFormat}
					       min={moment(min).locale(locale)}
					       max={moment(max).locale(locale)}
					       onChange={this.onFieldDateChange}
					       openDatePicker={this.openDatePicker}
					       closeDatePicker={this.closeDatePicker}
					       theme={theme}
					       isDisabled={isDisabled}
					       isInvalid={isInvalid}
					       locale={locale}
					       placeholder={placeholder}
					       isDatePickerOpened={this.state.isOpened}/>
				)}
				{openCalendarIcon && (
					<ButtonIcon onClick={this.onIconClick}
					            icon={openCalendarIcon}
					            theme={openCalendarBtnTheme}
					            isDisabled={isDisabled}/>
				)}
				<Popover theme={popoverTheme}
				         isOpened={this.state.isOpened}
				         anchor={this._anchor}
				         closeOnClickAway={true}
				         onRequestClose={this.onPopoverRequestClose}>
					<Calendar theme={calendarTheme}
					          value={isInvalid ? moment().format() : value}
					          onChange={this.onCalendarDateChange}
					          min={min}
					          max={max}
					          headerDateFormat={headerDateFormat}
					          dayFormat={dayFormat}
					          headerDayFormat={headerDayFormat}
					          previousMonthIcon={previousMonthIcon}
					          nextMonthIcon={nextMonthIcon}
					          locale={locale}/>
				</Popover>
			</div>
		)
	}

	openDatePicker = () => {
		this.setState({
			isOpened: true
		});
	}

	closeDatePicker = () => {
		this.setState({
			isOpened: false
		});
	}

	onFieldDateChange = (newDate: Moment) => {
		const { min, max, onValueChange} = this.props;

		if (isDateValid(newDate, min, max)) {
			this.setState({
				isOpened: false
			});
			onValueChange && onValueChange(newDate.format());
		} else {
			this.setState({
				isOpened: false
			});
			onValueChange && onValueChange(null); // empty value
		}
	}

	onCalendarDateChange = (dateISO: string) => {
		const {onValueChange} = this.props;
		this.setState({
			isOpened: false
		});

		onValueChange && onValueChange(dateISO);
	}

	onPopoverRequestClose = () => this.closeDatePicker();
	onIconClick = () => this.openDatePicker();
}

export type TDatePickerProps = ObjectClean<PartialKeys<TFullDatePickerProps, 'theme'>>;
export const DatePicker: ComponentClass<TDatePickerProps> = withTheme(DATE_PICKER)(RawDatePicker);