import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { TimeInput } from './TimeInput';
import { Demo } from '../demo/Demo';
import { Button } from '../Button/Button';
import { AddIcon } from '../../icons/add-icon';
import { DecreaseIcon } from '../../icons/decrease-icon';
import { SmallCrossIcon as ClearIcon } from '../../icons/small-cross-icon';
import { some, none } from 'fp-ts/lib/Option';
import { PeriodType, TTimeInputValue } from './TimeInput.model';

const time = {
	hours: some(1),
	minutes: some(20),
	seconds: some(35),
	periodType: some(PeriodType.AM),
};

const log = action('change');

class TimeInputPage extends React.Component<any, any> {
	state = {
		value: time,
	};

	render() {
		const { withSeconds } = this.props;
		return (
			<Demo>
				{withSeconds && <input type="time" id="time" step="1" />}
				{!withSeconds && <input type="time" id="time" />}
				<div>
					<TimeInput
						withPeriodType={this.props.withPeriodType}
						withSeconds={this.props.withSeconds}
						decrementIcon={<DecreaseIcon />}
						isDisabled={this.props.isDisabled}
						incrementIcon={<AddIcon />}
						error={this.props.error}
						clearIcon={<ClearIcon />}
						onValueChange={this.onTimeInputChange}
						value={this.state.value}
					/>
					<Button onClick={this.onClearClick}>clear</Button>
				</div>
			</Demo>
		);
	}

	onTimeInputChange = (value: TTimeInputValue) => {
		log(value);
		this.setState({ value });
	};

	onClearClick = () => {
		this.setState({
			value: {
				hours: none,
				minutes: none,
				seconds: none,
				periodType: none,
			},
		});
	};
}

storiesOf('TimeInput', module)
	.add('default', () => <TimeInputPage />)
	.add('disabled', () => <TimeInputPage isDisabled={true} />)
	.add('invalid', () => <TimeInputPage error={true} />)
	.add('With seconds only', () => <TimeInputPage withSeconds={true} />)
	.add('With period type only ', () => <TimeInputPage withPeriodType={true} />)
	.add('With seconds and period type', () => <TimeInputPage withSeconds={true} withPeriodType={true} />);
