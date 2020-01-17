import React from 'react';
import { storiesOf } from '@storybook/react';
import Demo from '../demo/Demo';
import { Button } from '../Button/Button';
import { Holdable } from './Holdable';

class HoldableDemo extends React.Component {
	state = {
		value: 0,
	};

	render() {
		return (
			<Demo>
				<Holdable onHold={this.onIncrementValue}>
					<Button onClick={this.onIncrementValue}>{`Click and hold: ${this.state.value}`}</Button>
				</Holdable>
			</Demo>
		);
	}

	onIncrementValue = () => {
		this.setState({
			value: this.state.value + 1,
		});
	};
}

storiesOf('Holdable', module).add('default', () => <HoldableDemo />);
