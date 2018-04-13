import * as React from 'react';
import * as moment from 'moment';
import Month from './Month';
import Week from './Week';
import Day from './Day';
import { PURE } from '../../utils/pure';
import {ObjectClean} from 'typelevel-ts';
import {withTheme} from '../../utils/withTheme';
import {PartialKeys} from '@devexperts/utils/dist/object/object';
import CalendarHeader from './CalendarHeader';
import { TCalendarTheme } from './Calendar.types';
import { Moment } from 'moment';

export const CALENDAR = Symbol('Calendar');

export type TFullCalendarProps = {
	value: string, // ISO - "2016-09-20T15:30:39.298Z"
	headerDateFormat: string,
	headerDayFormat: string,
	dayFormat: string,
	onChangeDisplayed: any,
	onChange: any,
	min: any, // ISO
	max: any, // ISO
	previousMonthIcon: string,
	nextMonthIcon: string,
	locale: string,
	theme: TCalendarTheme,
	CalendarHeader: any,
	Month: any,
	Week: any,
	Day: any,
}

@PURE
export default class RawCalendar extends React.Component<TFullCalendarProps> {
	static defaultProps = {
		CalendarHeader,
		Month,
		Week,
		Day,
		onChange: () => console.log('t'),
		min: null,
		max: null,
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

export type TCalendarProps = ObjectClean<PartialKeys<TFullCalendarProps, 'theme'>>;
export const Calendar: React.ComponentClass<TCalendarProps> = withTheme(CALENDAR)(RawCalendar);
