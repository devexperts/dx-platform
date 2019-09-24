import * as React from 'react';
import { Button, ButtonType } from './button';
import { Demo } from '../../../demo/demo';
import { boolean, text, select } from '@storybook/addon-knobs';

export default { title: 'Components/Atoms' };

export const ButtonPage = () => (
	<Demo>
		<Button
			type={select<ButtonType>('type', ['primary', 'secondary', 'tertiary', 'sell', 'buy'], 'secondary')}
			isDisabled={boolean('isDisabled', false)}>
			{text('content', 'Text')}
		</Button>
	</Demo>
);

ButtonPage.story = {
	name: 'Button',
	info: {
		inline: true,
	},
};
