import React from 'react';
import { Component } from 'react';
import Demo from '../demo/Demo';
import { ToggleButtons } from './ToggleButtons';
import { Button } from '../Button/Button';
import { Link } from '../Link/Link';

import { PURE } from '../../utils/pure';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

@PURE
class ToggleButtonsPage extends Component {
	state = {
		toggleIndex: 0,
	};

	render() {
		return (
			<Demo>
				<ToggleButtons defaultIndex={1} onChange={this.onToggleChange}>
					<Link>Toggle Link 1</Link>
					<Link>Toggle Link 2</Link>
					<Link>Toggle Link 3</Link>
				</ToggleButtons>
				<ToggleButtons toggleIndex={this.state.toggleIndex} isVertical={true} onChange={this.onToggleChange}>
					<Button>Toggle 4</Button>
					<Button>Toggle 5</Button>
					<Button>Toggle 6</Button>
				</ToggleButtons>
				<ToggleButtons toggleIndex={this.state.toggleIndex} isDisabled={true} onChange={this.onToggleChange}>
					<Button>Toggle 7</Button>
					<Button>Toggle 8</Button>
					<Button>Toggle 9</Button>
				</ToggleButtons>
				<ToggleButtons toggleIndex={this.state.toggleIndex} onChange={this.onToggleChange}>
					<Button onClick={action('clicked on Toggle 10')}>Toggle 10</Button>
					<Button onClick={action('clicked on Toggle 11')}>Toggle 11</Button>
					<Button onClick={action('clicked on Toggle 12')}>Toggle 12</Button>
				</ToggleButtons>
			</Demo>
		);
	}

	onToggleChange = (i: number) => {
		this.setState({
			toggleIndex: i,
		});
	};
}

storiesOf('Toggle Buttons', module).add('default', () => <ToggleButtonsPage />);
