import React from 'react';
import { PureComponent } from 'react';
import { storiesOf } from '@storybook/react';
import Demo from '../demo/Demo';
import { Deferred } from './Deferred';

type TDeferredPageState = {
	counter: number;
};

class DeferredPage extends PureComponent<{}, TDeferredPageState> {
	readonly state = {
		counter: 0,
	};

	private interval!: number;

	componentWillMount() {
		this.interval = window.setInterval(() => {
			this.setState({
				counter: this.state.counter + 1,
			});
		}, 3000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<Demo>
				<div>Additional content will render in 2 seconds...</div>
				<Deferred render={() => <div>I'm heavy timer: {this.state.counter}</div>} delay={2000} />
			</Demo>
		);
	}
}

storiesOf('Deferred', module).add('default', () => <DeferredPage />);
