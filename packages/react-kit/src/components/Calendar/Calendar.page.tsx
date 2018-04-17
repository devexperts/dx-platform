import * as React from 'react';
import { storiesOf, action } from '@devexperts/tools/dist/utils/storybook';
import { Demo } from '../demo/Demo';
import * as moment from 'moment';
import { Day } from './Day';
import { Week } from './Week';
import { CalendarHeader } from './CalendarHeader';
import { Month } from './Month';
import { Calendar } from './Calendar';
import { Moment } from 'moment';
import { ShowPasswordIcon } from '../../icons/show-password-icon';
import { HidePasswordIcon } from '../../icons/hide-password-icon';

const date = moment();
const dateFormat = 'YYYY-MM-DDTHH:mm:ssZ';

type TDemoState = {
	value: string
	displayedDate?: Moment
}

class CalendarDemo extends React.Component<any, any> {

	state: TDemoState  = {
		value: new Date().toISOString()
	}

	render() {
		const { value, displayedDate } = this.state;
		return (
			<Demo>
				<section>
					displayedDate: {displayedDate ? displayedDate.format(dateFormat) : moment(value).format(dateFormat)}
				</section>
				<Calendar value={value}
						  previousMonthIcon={<ShowPasswordIcon />}
						  onChangeDisplayed={this.onChangeDisplayed}
						  onChange={this.onChange}
						  nextMonthIcon={<HidePasswordIcon />} />
			</Demo>
		);
	}

	onChangeDisplayed = (displayedDate: Moment) => {
		this.setState({
			displayedDate
		});
	}

	onChange = (value: any) => {
		this.setState({
			value
		});
	}
}



storiesOf('Calendar', module)
	.add('Day', () => (
		<Demo>
			<Day value={date.clone()} dayFormat='DD' onChange={action('onChange')}/>
		</Demo>
	))
	.add('Week', () => (
		<Demo>
			<Week startOfMonth={date.clone().startOf('month')}
				  endOfMonth={date.clone().endOf('month')}
				  currentDate={date.clone()}
				  from={date.clone().startOf('week')}
				  Day={Day}
				  min={moment().subtract(5, 'days')}
				  selectedDate={moment()}
				  max={moment().subtract(1, 'days')}
				  dayFormat='D'
				  onChange={action('onChange')}
			/>
		</Demo>
	))
	.add('CalendarHeader', () => (
		<Demo>
			<CalendarHeader
				value={date.clone()}
				previousMonthIcon={<ShowPasswordIcon />}
				nextMonthIcon={<HidePasswordIcon />}
				onChange={action('onChangeMonth')}
				headerDateFormat="MMM YYYY"
				locale="en"
			/>
		</Demo>
	))
	.add('Month', () => (
		<Demo>
			<Month startOfMonth={date.clone().startOf('month')}
				   endOfMonth={date.clone().endOf('month')}
				   currentDate={date.clone()}
				   Day={Day}
				   Week={Week}
				   headerDayFormat='ddd'
				   min={moment().subtract(5, 'days')}
				   selectedDate={moment()}
				   max={moment().subtract(1, 'days')}
				   dayFormat='DD'
				   onChange={action('onChange')}
			/>
		</Demo>
	))
	.add('Calendar', () => <CalendarDemo/>)