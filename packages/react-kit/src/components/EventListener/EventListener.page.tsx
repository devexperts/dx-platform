import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Demo from '../demo/Demo';
import { EventListener } from './EventListener';

storiesOf('EventListener', module).add('default', () => (
	<Demo>
		<EventListener target="window" onClick={action('click')}>
			<div>hi</div>
		</EventListener>
	</Demo>
));
