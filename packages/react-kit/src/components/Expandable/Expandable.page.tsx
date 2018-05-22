import * as React from 'react';

import { storiesOf } from '@devexperts/tools/dist/utils/storybook';
import { Demo } from '../demo/Demo';
import { Expandable } from './Expandable';
import { stateful } from '../Control/Control';
import { ExpandableHandler } from './ExpandableHandler';

const Stateful = stateful()(Expandable);

class CustomHandler extends React.Component<any> {
	render() {
		const {theme, isExpanded} = this.props;
		const text = isExpanded ? 'Close me!' : 'Open me!';

		return (
			<ExpandableHandler theme={theme} isExpanded={isExpanded}>
				<div>{text}</div>
			</ExpandableHandler>
		);
	}
}


storiesOf('Expandable', module)
	.add('default', () => (
		<Demo>
			<Stateful Handler={CustomHandler}>
				You will not be asked for further confirmation of trades. <br/>
				Trades will be executed with on click.
			</Stateful>
		</Demo>
	))
