import * as React from 'react';
import { storiesOf, action } from '@devexperts/tools/dist/utils/storybook';
import { TimeInput, TTime } from './TimeInput';
import { Demo } from '../demo/Demo';
import { Button } from '../Button/Button';
import { AddIcon } from '../../icons/add-icon';
import { DecreaseIcon } from '../../icons/decrease-icon';
import { SmallCrossIcon  as ClearIcon } from '../../icons/small-cross-icon';

const time = {
	hours: 1,
	minutes: 20
};

const log = action('change');

class TimeInputPage extends React.Component<any, any> {
	state = {
		value: time
	};

	render() {
		return (
			<Demo>
				<input type="time" id="time"/>
				<div>
					<TimeInput decrementIcon={<DecreaseIcon />}
							   isDisabled={this.props.isDisabled}
							   incrementIcon={<AddIcon />}
							   error={this.props.error}
							   clearIcon={<ClearIcon />}
							   onValueChange={this.onTimeInputChange}
							   value={this.state.value}/>
					<Button onClick={this.onClearClick}>clear</Button>
				</div>
			</Demo>
		);
	}

	onTimeInputChange = (value: TTime) => {
		log(value);
		this.setState({
			value
		});
	}

	onClearClick = () => {
		this.setState({
			value: null
		});
	}
}

storiesOf('TimeInput', module)
	.add('default', () => <TimeInputPage/>)
	.add('disabled', () => <TimeInputPage isDisabled={true}/>)
	.add('invalid', () => <TimeInputPage error={true}/>);