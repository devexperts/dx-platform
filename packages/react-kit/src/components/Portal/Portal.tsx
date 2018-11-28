import * as React from 'react';
import { ReactNode } from 'react';
import * as ReactDOM from 'react-dom';

export type TPortalProps = {
	children: ReactNode;
	container?: Element;
};

export class Portal extends React.Component<TPortalProps> {
	private rootElement = document.createElement('div');

	componentDidMount() {
		const container = this.getContainer();
		container.appendChild(this.rootElement);
	}

	componentWillUnmount() {
		const container = this.getContainer();
		container.removeChild(this.rootElement);
	}

	render() {
		return ReactDOM.createPortal(this.props.children, this.rootElement);
	}

	getContainer() {
		return this.props.container || document.body;
	}
}
