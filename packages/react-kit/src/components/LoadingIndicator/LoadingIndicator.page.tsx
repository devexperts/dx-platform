import * as React from 'react';
import { storiesOf } from '@devexperts/tools/dist/utils/storybook';
import Demo from '../demo/Demo';
import { LoadingIndicator } from './LoadingIndicator';

storiesOf('LoadingIndicator', module).add('default', () => (
	<Demo>
		<LoadingIndicator />
	</Demo>
));
