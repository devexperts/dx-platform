import * as React from 'react';
import { storiesOf } from '@devexperts/tools/dist/utils/storybook';
import * as classnames from 'classnames';
import Demo from '../demo/Demo';
import * as moment from 'moment';
import { DatePicker } from './DatePicker';
import * as css from './DatePicker.page.styl';
import { stateful } from '../Control/Control';


import { MoveLeftIcon as PreviousMonthIcon } from '../../icons/move-left-icon';
import { MoveRightIcon  as NextMonthIcon } from '../../icons/move-right-icon';
import { OpenCalendarIcon } from '../../icons/open-calendar-icon';


const value = new Date().toISOString();

const CustomLabelField = (props: any) => {
	const onContextMenu = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		props.onChange(moment().locale(props.locale)); // set current date
	};

	const onClick = () => {
		props.openDatePicker();
	};

	const className = classnames(css.customLabelField, props.theme.field);

	return (
		<span onClick={onClick}
		      onContextMenu={onContextMenu}
		      className={className}>
			{props.isInvalid ? props.placeholder : props.value.format(props.dateFormat)}
		</span>
	);
};

const Stateful = stateful()(DatePicker);

storiesOf('DatePicker', module)
	.add('default', () => (
		<Demo>
			<Stateful defaultValue={value} openCalendarIcon={<OpenCalendarIcon/>}
			          previousMonthIcon={<PreviousMonthIcon/>}
			          nextMonthIcon={<NextMonthIcon/>} />
		</Demo>
	))
	.add('custom label', () => (
		<Demo>
			<Stateful defaultValue={value} placeholder="Not selected" openCalendarIcon={<OpenCalendarIcon/>}
			          previousMonthIcon={<PreviousMonthIcon/>}
			          nextMonthIcon={<NextMonthIcon/>}
			          fieldComponent={CustomLabelField} fieldDateFormat="MMMM YYYY"
			          headerDateFormat="YYYY, MMMM"
			          dayFormat="DD"/>
		</Demo>
	))