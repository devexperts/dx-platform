import { Moment } from 'moment';
import * as moment from 'moment';

export const isDateValid = (momentDate: Moment, min: any = null, max: any = null) => {
	// set `min` and `max` to null by default because of `moment(undefined).isValid() === true`
	const minBound = moment.isMoment(min) ? min : moment(min);
	const maxBound = moment.isMoment(max) ? max : moment(max);

	return momentDate.isValid() &&
		(minBound.isValid() ? momentDate.isSameOrAfter(minBound, 'day') : true) &&
		(maxBound.isValid() ? momentDate.isSameOrBefore(maxBound, 'day') : true);
};

export const fullWeeksInMonth = (date: Moment) => {
	const startOfFirstWeek = date.clone().startOf('month').startOf('week');
	const endOfLastWeek = date.clone().endOf('month').endOf('week');
	return Math.ceil(endOfLastWeek.diff(startOfFirstWeek, 'days') / 7);
};