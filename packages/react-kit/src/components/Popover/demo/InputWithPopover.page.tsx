import React from 'react';
import { Input } from '../../input/Input';
import { Popover } from '../Popover';
import { PopoverPlacement, PopoverAlign } from '../Popover.model';
import { stateful } from '../../Control/Control';
import Demo from '../../demo/Demo';

const StatefulInput = stateful()(Input);

type TInputWithPopoverPageState = Readonly<{
	isOpened: boolean;
}>;

export class InputWithPopoverPage extends React.PureComponent<{}, TInputWithPopoverPageState> {
	private anchor: HTMLElement | null = null;

	readonly state: TInputWithPopoverPageState = {
		isOpened: false,
	};

	render() {
		const { isOpened } = this.state;

		return (
			<Demo>
				<p>Case when we have to show popover when losing focus on input</p>
				<StatefulInput
					defaultValue={'input'}
					onBlur={this.onBlur}
					onFocus={this.onFocus}
					ref={(e: any) => (this.anchor = e)}
				/>

				{isOpened && (
					<Popover
						anchor={this.anchor}
						isOpened={true}
						closeOnClickAway={true}
						onRequestClose={this.onPopoverRequestClose}
						hasArrow={true}
						placement={PopoverPlacement.Bottom}
						align={PopoverAlign.Left}>
						<div>popover content</div>
					</Popover>
				)}
			</Demo>
		);
	}

	private onBlur = () => {
		this.setState({ isOpened: true });
	};

	private onFocus = () => {
		this.setState({ isOpened: false });
	};

	private onPopoverRequestClose = () => {
		this.setState({ isOpened: false });
	};
}
