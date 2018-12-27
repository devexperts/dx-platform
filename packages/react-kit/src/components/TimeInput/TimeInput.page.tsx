import * as React from 'react';
import { storiesOf, action } from '@devexperts/tools/dist/utils/storybook';
import { TimeInput, TTime } from './TimeInput';
import { Demo } from '../demo/Demo';
import { Button } from '../Button/Button';
import { AddIcon } from '../../icons/add-icon';
import { DecreaseIcon } from '../../icons/decrease-icon';
import { SmallCrossIcon as ClearIcon } from '../../icons/small-cross-icon';
import { Component } from 'react';

const time = {
	hours: 1,
	minutes: 20,
	seconds: 35,
	periodType: 'AM',
};

const log = action('change');

class TimeInputPage extends React.Component<any, any> {
	state = {
		value: time,
	};

	render() {
		return (
			<Demo>
				<NativeInput withSeconds={this.props.withSeconds} />
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

	onTimeInputChange = (value: TTime | undefined | null) => {
		log(value);
		this.setState({
			value,
		});
	};

	onClearClick = () => {
		this.setState({
			value: null,
		});
	};
}

type TNativeInputProps = {
	withSeconds: boolean;
};
class NativeInput extends Component<TNativeInputProps> {
	render() {
		const { withSeconds } = this.props;
		console.log(withSeconds);
		return (
			<>
				{withSeconds && <input type="time" id="time" step="1" />}
				{!withSeconds && <input type="time" id="time" />}
			</>
		);
	}
}

storiesOf('TimeInput', module)
	.add('default', () => <TimeInputPage />)
	.add('disabled', () => <TimeInputPage isDisabled={true} />)
	.add('invalid', () => <TimeInputPage error={true} />)
	.add('With seconds only', () => <TimeInputPage withSeconds={true} />)
	.add('With period type only ', () => <TimeInputPage withPeriodType={true} />)
	.add('With seconds and period type', () => <TimeInputPage withSeconds={true} withPeriodType={true} />);
