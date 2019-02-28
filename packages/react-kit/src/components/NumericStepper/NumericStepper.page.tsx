import * as React from 'react';
import { storiesOf } from '@devexperts/tools/dist/utils/storybook';
import { Demo } from '../demo/Demo';
import { NumericStepper } from './NumericStepper';
import { AddIcon } from '../../icons/add-icon';
import { DecreaseIcon } from '../../icons/decrease-icon';
import { SmallCrossIcon as ClearIcon } from '../../icons/small-cross-icon';

const dollarFormatter = (value: string | number) => `$${value}`;
const dollarParser = (input: string) => {
	const newValue = parseInt(input.replace(/\D/g, ''), 10);
	return isNaN(newValue) ? 0 : newValue;
};

import { stateful } from '../Control/Control';

const StatefulStepper = stateful()(NumericStepper);

type DemoStepperState = {
	value: number;
	isDisabled: boolean;
	isDisabledMinButton: boolean;
	isDisabledMaxButton: boolean;
};

class DemoStepper extends React.Component {
	private min = -10;
	private max = 20;

	state: DemoStepperState = {
		value: 5,
		isDisabled: false,
		isDisabledMinButton: false,
		isDisabledMaxButton: false,
	};

	render() {
		const { value, isDisabledMaxButton, isDisabledMinButton, isDisabled } = this.state;
		return (
			<div>
				<div>
					<button onClick={this.onClick}>Toggle Full Disabled</button>
				</div>
				<NumericStepper
					decrementIcon={<DecreaseIcon />}
					isDisabled={isDisabled}
					isDisabledMinButton={isDisabledMinButton}
					isDisabledMaxButton={isDisabledMaxButton}
					incrementIcon={<AddIcon />}
					min={this.min}
					max={this.max}
					step={1}
					clearIcon={<ClearIcon />}
					onValueChange={this.onValueChange}
					value={value}
				/>
			</div>
		);
	}

	private onClick = () => {
		this.setState({
			isDisabled: !this.state.isDisabled,
		});
	};

	private onValueChange = (value: number) => {
		this.setState({
			value,
			isDisabledMinButton: value <= this.min,
			isDisabledMaxButton: value >= this.max,
		});
	};
}

storiesOf('NumericStepper', module)
	.add('default', () => (
		<Demo>
			<DemoStepper />
		</Demo>
	))
	.add('disabled', () => (
		<Demo>
			<StatefulStepper
				decrementIcon={<DecreaseIcon />}
				incrementIcon={<AddIcon />}
				isDisabled={true}
				min={0}
				step={1}
				clearIcon={<ClearIcon />}
				defaultValue={5}
			/>
		</Demo>
	))
	.add('with custom formatter', () => (
		<Demo>
			<StatefulStepper
				decrementIcon={<DecreaseIcon />}
				incrementIcon={<AddIcon />}
				min={0}
				step={1}
				parser={dollarParser}
				formatter={dollarFormatter}
				clearIcon={<ClearIcon />}
				defaultValue={5}
			/>
		</Demo>
	));
