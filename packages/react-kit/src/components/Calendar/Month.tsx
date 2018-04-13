import * as React from 'react';
import { Moment } from 'moment';
import * as moment from 'moment';
import Week from './Week';
import { PURE } from '../../utils/pure';
import { TCalendarTheme } from './Calendar.types';

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
	Day: React.ComponentClass<any> | React.SFC<any>,
	Week: React.ComponentClass<any> | React.SFC<any>,
}

@PURE
export default class Month extends React.Component<TFullMonthProps> {

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