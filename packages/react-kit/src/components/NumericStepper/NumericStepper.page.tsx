import React from 'react';
import { storiesOf } from '@storybook/react';
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

storiesOf('NumericStepper', module)
	.add('default', () => (
		<Demo>
			<StatefulStepper
				decrementIcon={<DecreaseIcon />}
				incrementIcon={<AddIcon />}
				min={-10}
				max={10}
				step={1}
				clearIcon={<ClearIcon />}
				defaultValue={5}
			/>
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
