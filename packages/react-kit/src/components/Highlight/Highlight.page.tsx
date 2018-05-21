import * as React from 'react';
import { storiesOf } from '@devexperts/tools/dist/utils/storybook';
import Demo from '../demo/Demo';
import { Highlight } from './Highlight';

storiesOf('Highlight', module).add('Default', () => (
	<Demo>
		<div>
			<Highlight search="test">test/test2 fdgkjdklfj dfgs test sdkfjksdfksaratestjfkdsjl</Highlight>
		</div>

		<div>
			<Highlight>test/test2 fdgkjdklfj dfgs test sdkfjksdfksaratestjfkdsjl</Highlight>
		</div>

		<div>
			<Highlight search="with spaces">search="with spaces"</Highlight>
		</div>
	</Demo>
));
