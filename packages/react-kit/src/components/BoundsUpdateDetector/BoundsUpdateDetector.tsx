import * as React from 'react';
import * as ReactDOM from 'react-dom';

export type TSize = {
	width: number,
	height: number
};

export type TBoundsUpdateDetectorProps = {
	onUpdate: (size: TSize) => void,
	children: any
};

export class BoundsUpdateDetector extends React.Component<TBoundsUpdateDetectorProps> {
	private size: TSize;

	componentDidMount() {
		this.size = this.getSize();
	}

	getSize() {
		const element = ReactDOM.findDOMNode<HTMLElement>(this);
		return {
			width: element.offsetWidth,
			height: element.offsetHeight
		};
	}

	componentDidUpdate(prevProps: TBoundsUpdateDetectorProps, prevState: TBoundsUpdateDetectorProps) {
		const size = this.getSize();
		const { width, height } = this.size;
		if (height !== size.height || width !== size.width) {
			this.size = size;
			this.props.onUpdate && this.props.onUpdate(size);
		}
	}

	render() {
		return this.props.children;
	}
}