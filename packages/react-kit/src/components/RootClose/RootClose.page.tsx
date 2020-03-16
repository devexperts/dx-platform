import * as React from 'react';
import { RootClose } from './RootClose';
// @ts-ignore
import { ResizableBox } from 'react-resizable';
import Demo from '../demo/Demo';
import { storiesOf } from '@storybook/react';
import * as css from './RootClose.styl';
import { action } from '@storybook/addon-actions';

const onBlur = () => action('onBlur')();

export class Test extends React.Component<any, any> {
	readonly ref: any;
	readonly onResize = (e: any, data: any) => {
		this.ref.current.style.height = `${data.size.height}px`;
		this.ref.current.style.width = `${data.size.width}px`;
	};
	readonly resizableBoxProps = {
		onResize: this.onResize,
		minConstraints: [100, 100],
		maxConstraints: [150, 150],
		resizeHandles: ['se'],
	};
	readonly state = {
		width: 100,
		height: 100,
	};

	constructor(props: any) {
		super(props);
		this.ref = React.createRef();
	}

	render() {
		const { height, width } = this.state;
		return (
			<>
				<div>Should not blur on drag end</div>
				<RootClose onRootClose={onBlur}>
					<div className={css.container}>
						<ResizableBox {...this.resizableBoxProps} height={height} width={width}>
							<div ref={this.ref} />
						</ResizableBox>
					</div>
				</RootClose>

				<div>Should blur on drag end</div>
				<RootClose onRootClose={onBlur}>
					<div className={css.container}>
						<ResizableBox height={height} width={width}>
							<div ref={this.ref} />
						</ResizableBox>
					</div>
				</RootClose>
			</>
		);
	}
}

storiesOf('RootClose', module).add('Default', () => (
	<Demo>
		<Test />
	</Demo>
));
