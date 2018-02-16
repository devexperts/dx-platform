import * as React from 'react';
import { action, storiesOf } from '@devexperts/tools/dist/utils/storybook';
import Demo from '../demo/Demo';
import { EventListener } from './EventListener';

storiesOf('EventListener', module)
	.add('default', () => (
		<Demo>
			<EventListener target="window" onClick={action('click')}>
				<div>hi</div>
			</EventListener>
		</Demo>
	));