import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Demo } from '../demo/Demo';

import { Input } from './Input';

import css from './Input.page.styl';
import demoCss from './Input.demo.styl';
import { stateful } from '../Control/Control';

const darkDemoTheme = {
	container: css.container,
};

const Stateful = stateful()(Input);

storiesOf('Input', module)
	.add('Default', () => (
		<Demo theme={darkDemoTheme}>
			<Stateful defaultValue="<Input/>" onValueChange={action('change') as any} />
			<Input type="hidden" tabIndex={0} value="123" onValueChange={undefined as any}>
				<div className={demoCss.input}>div</div>
			</Input>
		</Demo>
	))
	.add('Readonly', () => {
		return (
			<Demo theme={darkDemoTheme}>
				<Stateful defaultValue="<Input/>" isReadOnly={true} />
			</Demo>
		);
	})
	.add('Disabled', () => {
		return (
			<Demo theme={darkDemoTheme}>
				<Stateful defaultValue="Test Value" isDisabled={true} />
			</Demo>
		);
	})
	.add('Invalid', () => (
		<Demo theme={darkDemoTheme}>
			<Stateful defaultValue="Error" error="Error" />
		</Demo>
	));
