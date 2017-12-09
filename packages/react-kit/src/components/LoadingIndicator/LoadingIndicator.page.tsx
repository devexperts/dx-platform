import React from 'react';
import { storiesOf, action } from '@devexperts/tools/utils/storybook';
import Demo from '../demo/Demo';
import {LoadingIndicator} from './LoadingIndicator';

storiesOf('LoadingIndicator', module).add('default', () => (
	<Demo>
		<LoadingIndicator/>
	</Demo>
));