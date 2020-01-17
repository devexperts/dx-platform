import React from 'react';

import { storiesOf } from '@storybook/react';
import { Demo } from '../demo/Demo';
import { Dropdown } from './Dropdown';
import { Component, MouseEventHandler, ReactNode, SFC } from 'react';
import { Button } from '../Button/Button';
import { WithInnerRef } from '../../utils/typings';
import { PURE } from '../../utils/pure';
import { stateful } from '../Control/Control';

type TAnchorProps = WithInnerRef<{
	onClick: MouseEventHandler<Element>;
	children: ReactNode;
}>;

const StatefulDropdown = stateful('isOpened', 'onToggle')(Dropdown);

@PURE
class AnchorClass extends Component<TAnchorProps> {
	render() {
		const { innerRef, children, onClick } = this.props;

		console.log('rendering anchor class');

		return (
			<Button ref={innerRef} onClick={onClick}>
				Class Anchor
				{children}
			</Button>
		);
	}
}

const AnchorSFC: SFC<TAnchorProps> = props => {
	const { innerRef, children, onClick } = props;
	return (
		<Button ref={innerRef} onClick={onClick}>
			SFC Anchor
			{children}
		</Button>
	);
};

storiesOf('Dropdown', module)
	.add('with class Anchor', () => (
		<Demo>
			<StatefulDropdown defaultValue={undefined} Anchor={AnchorClass}>
				<div>hi!</div>
			</StatefulDropdown>
		</Demo>
	))
	.add('with SFC Anchor', () => (
		<Demo>
			<StatefulDropdown defaultValue={undefined} Anchor={AnchorSFC} onToggle={console.log.bind(console)}>
				hi
			</StatefulDropdown>
		</Demo>
	))
	.add('with force close', () => (
		<Demo>
			<DropdownPage />
		</Demo>
	));

class DropdownPage extends Component<any, any> {
	private forceClose!: Function;

	render() {
		return (
			<div>
				<StatefulDropdown defaultValue={undefined} Anchor={AnchorClass}>
					<Button onClick={this.onForceCloseClick}>Force close</Button>
				</StatefulDropdown>
			</div>
		);
	}

	onForceCloseClick = () => {
		this.forceClose();
	};

	getForceClose = (close: Function) => {
		this.forceClose = close;
	};
}
