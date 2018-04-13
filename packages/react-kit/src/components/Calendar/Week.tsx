import * as React from 'react';
import { Moment } from 'moment';
import Day from './Day';
import { PURE } from '../../utils/pure';
import { TCalendarTheme } from './Calendar.types';
import { isDateValid } from '../../utils/date';

export type TFullWeekProps = {
	from: Moment,
	dayFormat: string,
	min: Moment,
	max: Moment,
	selectedDate: Moment,
	startOfMonth: Moment,
	endOfMonth: Moment,
	currentDate: Moment,
	onChange: any,
	theme: TCalendarTheme,
	Day: React.ComponentClass<any> | React.SFC<any>,
}

@PURE
export default class Week extends React.Component<TFullWeekProps> {
	render() {
		const {
			theme,
			from,
			dayFormat,
			onChange,
			min,
			max,
			startOfMonth,
			endOfMonth,
			currentDate,
			selectedDate,
			Day
		} = this.props;

		return (
			<div className={theme.week}>
				{Array.from(new Array(7).keys()).map(i => {
					const date = from.clone().add(i, 'days');

					const isDateInBounds = isDateValid(date, startOfMonth, endOfMonth) &&
						isDateValid(date, min, max);
					const isCurrent = date.isSame(currentDate, 'day');
					const isSelected = date.isSame(selectedDate, 'day');

					return (
						<Day value={date}
							 onChange={onChange}
							 dayFormat={dayFormat}
							 className={theme.day}
							 isDisabled={!isDateInBounds}
							 isCurrent={isCurrent}
							 isSelected={isSelected}
							 theme={theme}
							 key={i}/>
					);
				})}
			</div>
		);
	}
}