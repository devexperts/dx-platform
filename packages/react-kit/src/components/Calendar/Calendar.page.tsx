import * as React from 'react';
import { storiesOf, action } from '@devexperts/tools/dist/utils/storybook';
import { Demo } from '../demo/Demo';

storiesOf('Calendar', module)
	.add('Default', () => (
		<Demo>
			<div>test</div>
		</Demo>
	));