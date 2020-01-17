import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ResizeDetector } from './ResizeDetector';
import Demo from '../demo/Demo';

storiesOf('ResizeDetector', module).add('default', () => (
	<Demo>
		Resize current window to log events in Action Logger below
		<ResizeDetector onResize={action('resized')} />
	</Demo>
));
