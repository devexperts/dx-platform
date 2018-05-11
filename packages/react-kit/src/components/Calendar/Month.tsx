import * as React from 'react';
import { Moment } from 'moment';
import { PURE } from '../../utils/pure';
import { ObjectClean } from 'typelevel-ts';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { TCalendarTheme } from './Calendar.types';
import { TWeekProps } from './Week';
import { TDayProps } from './Day';

export const MONTH = Symbol('Month');

export type TFullMonthProps = {
	selectedDate: Moment,
	onChange: any,
	min: Moment,
	max: Moment,
	startOfMonth: Moment,
	endOfMonth: Moment,
	currentDate: Moment,
	headerDayFormat: string,
	dayFormat: string,
	theme: TCalendarTheme,
	Day: React.ComponentType<TDayProps>,
	Week: React.ComponentType<TWeekProps>,
}

@PURE
class RawMonth extends React.Component<TFullMonthProps> {

	render() {
		const {
			selectedDate,
			theme,
			dayFormat,
			onChange,
			min,
			max,
			startOfMonth,
			endOfMonth,
			currentDate,
			Week,
			Day,
		} = this.props;

		const from = startOfMonth.clone().startOf('week');

		return (
			<div className={theme.month}>
				{this.renderDaysHeader(from.clone())}
				{Array.from(new Array(6).keys()).map(week => (
					<Week selectedDate={selectedDate.clone()}
						  onChange={onChange}
						  key={week}
						  Day={Day}
						  from={from.clone().add(week, 'weeks')}
						  dayFormat={dayFormat}
						  theme={theme}
						  min={min}
						  max={max}
						  startOfMonth={startOfMonth}
						  endOfMonth={endOfMonth}
						  currentDate={currentDate}/>
				))}
			</div>
		);
	}

	renderDaysHeader(startDate: Moment) {
		const {theme, headerDayFormat} = this.props;
		return (
			<div className={theme.monthHeader}>
				{Array.from(new Array(7).keys()).map(i => (
					<div className={theme.monthHeader__day}
						 key={i}>
						{startDate.clone().add(i, 'days').format(headerDayFormat)}
					</div>
				))}
			</div>
		);
	}
}

export type TMonthProps = ObjectClean<PartialKeys<TFullMonthProps, 'theme'>>;
export const Month: React.ComponentClass<TMonthProps> = withTheme(MONTH)(RawMonth);