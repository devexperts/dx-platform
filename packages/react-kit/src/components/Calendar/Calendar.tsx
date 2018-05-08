import * as React from 'react';
import * as moment from 'moment';
import { PURE } from '../../utils/pure';
import { ObjectClean } from 'typelevel-ts';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { CalendarHeader, TCalendarHeaderProps } from './CalendarHeader';
import { TCalendarTheme } from './Calendar.types';
import { Moment } from 'moment';
import { Month, TMonthProps } from './Month';
import { Day, TDayProps } from './Day';
import { TWeekProps, Week } from './Week';
import { ComponentType } from 'react';

export const CALENDAR = Symbol('Calendar');

export type TFullCalendarProps = {
	value: string, // ISO - "2016-09-20T15:30:39.298Z"
	headerDateFormat: string,
	headerDayFormat: string,
	dayFormat: string,
	onChangeDisplayed?: (displayedDate: Moment) => void,
	onChange: (value: string) => void,
	min: string, // ISO
	max: string, // ISO
	previousMonthIcon: React.ReactElement<any>,
	nextMonthIcon: React.ReactElement<any>,
	locale: string,
	theme: TCalendarTheme,
	CalendarHeader: any,
	Month: ComponentType<TMonthProps>,
	Week: ComponentType<TWeekProps>,
	Day: ComponentType<TDayProps>,
}

@PURE
export default class RawCalendar extends React.Component<TFullCalendarProps> {
	static defaultProps = {
		CalendarHeader,
		Month,
		Week,
		Day,
		min: '',
		max: '',
		headerDateFormat: 'MMM YYYY',
		dayFormat: 'D',
		headerDayFormat: 'ddd',
		locale: 'en'
	}

	state = {
		displayedDate: moment(this.props.value)
	}

	componentWillReceiveProps(newProps: TFullCalendarProps) {
		this.setState({
			displayedDate: moment(newProps.value)
		});
	}

	render() {
		const {
			theme,
			onChange,
			min,
			max,
			headerDateFormat,
			headerDayFormat,
			dayFormat,
			previousMonthIcon,
			nextMonthIcon,
			locale,
			value,
			CalendarHeader,
			Month,
			Week,
			Day
		} = this.props;

		const displayedDate = this.state.displayedDate.locale(locale);

		return (
			<div className={theme.container}>
				<CalendarHeader theme={theme}
								value={displayedDate.clone()}
								headerDateFormat={headerDateFormat}
								previousMonthIcon={previousMonthIcon}
								onChange={this.onChangeDisplayedDate}
								nextMonthIcon={nextMonthIcon}/>
				<Month selectedDate={moment(value).locale(locale)}
					   onChange={onChange}
					   Week={Week}
					   Day={Day}
					   startOfMonth={displayedDate.clone().startOf('month')}
					   endOfMonth={displayedDate.clone().endOf('month')}
					   currentDate={moment().locale(locale)}
					   min={moment(min).locale(locale)}
					   max={moment(max).locale(locale)}
					   theme={theme}
					   headerDayFormat={headerDayFormat}
					   dayFormat={dayFormat}/>
			</div>
		);
	}

	onChangeDisplayedDate = (displayedDate: Moment) => {
		const { onChangeDisplayed } = this.props;
		onChangeDisplayed && onChangeDisplayed(displayedDate);

		this.setState({
			displayedDate
		});
	}
}

export type TCalendarProps = ObjectClean<PartialKeys<TFullCalendarProps, 'theme' | 'CalendarHeader' | 'Month' | 'locale' | 'Week' | 'Day' | 'min' | 'max' | 'headerDateFormat' | 'headerDayFormat' | 'dayFormat'>>;
export const Calendar: React.ComponentClass<TCalendarProps> = withTheme(CALENDAR)(RawCalendar);
