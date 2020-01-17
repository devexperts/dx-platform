import React from 'react';
import { shouldComponentUpdate } from '../../utils/pure';

export type TPureProps = {
	[key: string]: any;
	children: Function;
};

export class Pure extends React.Component<TPureProps> {
	shouldComponentUpdate(newProps: TPureProps, newState: TPureProps) {
		const propsCopy: TPureProps = Object.assign({}, this.props);
		const newPropsCopy: TPureProps = Object.assign({}, newProps);
		delete propsCopy['children'];
		delete newPropsCopy['children'];
		return shouldComponentUpdate(propsCopy, this.state, newPropsCopy, newState);
	}

	render() {
		const children: Function = this.props.children;
		return children();
	}
}
