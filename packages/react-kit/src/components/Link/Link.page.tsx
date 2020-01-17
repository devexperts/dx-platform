import React from 'react';
import { storiesOf } from '@storybook/react';
import Demo from '../demo/Demo';
import { Link } from './Link';

storiesOf('Link', module).add('default', () => (
	<Demo>
		<Link href="#">Empty Hash</Link>
		{' | '}
		<Link href="http://google.com" isDisabled={true}>
			Disabled
		</Link>
		{' | '}
		<Link href="http://google.com" target="_blank" rel="noopener noreferrer">
			https://google.com
		</Link>
	</Demo>
));
