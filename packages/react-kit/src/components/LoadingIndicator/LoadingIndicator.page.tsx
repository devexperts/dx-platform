import React from 'react';
import { storiesOf } from '@storybook/react';
import Demo from '../demo/Demo';
import { LoadingIndicator } from './LoadingIndicator';

storiesOf('LoadingIndicator', module).add('default', () => (
	<Demo>
		<LoadingIndicator />
	</Demo>
));
