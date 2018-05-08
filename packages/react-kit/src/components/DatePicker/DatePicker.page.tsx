import * as React from 'react';
import { storiesOf } from '@devexperts/tools/dist/utils/storybook';
import * as classnames from 'classnames';
import Demo from '../demo/Demo';
import * as moment from 'moment';
import { DatePicker } from './DatePicker';
import * as css from './DatePicker.page.styl';
import { stateful } from '../Control/Control';


const value = new Date().toISOString();

class FakeIcon extends React.Component {
	render() {
		const { text } = this.props;
		return (
			<div>{text}</div>
		)
	}
}

const CustomLabelField = (props: any) => {
	const onContextMenu = e => {
		e.preventDefault();
		props.onChange(moment().locale(props.locale)); // set current date
	};

	const onClick = e => {
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
			<Stateful defaultValue={value} openCalendarIcon={<FakeIcon text="Op"/>}/>
		</Demo>
	))
	.add('custom label', () => (
		<Demo>
			<Stateful defaultValue={value} placeholder="Not selected" openCalendarIcon={<FakeIcon text="Op"/>}
			          fieldComponent={CustomLabelField} fieldDateFormat="MMMM YYYY"
			          headerDateFormat="YYYY, MMMM"
			          dayFormat="DD"/>
		</Demo>
	))