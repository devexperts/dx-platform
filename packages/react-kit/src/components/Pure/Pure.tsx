import React, { PropsWithChildren } from 'react';
import { shouldComponentUpdate } from '../../utils/pure';

export type TPureProps = PropsWithChildren<{
	[key: string]: any;
}>;

export class Pure extends React.Component<TPureProps> {
	shouldComponentUpdate(newProps: TPureProps, newState: TPureProps) {
		const propsCopy: TPureProps = Object.assign({}, this.props);
		const newPropsCopy: TPureProps = Object.assign({}, newProps);
		delete propsCopy['children'];
		delete newPropsCopy['children'];
		return shouldComponentUpdate(propsCopy, this.state, newPropsCopy, newState);
	}

	render() {
		const children = typeof this.props.children === 'function' ? (this.props.children as Function) : undefined;

		if (children) {
			return children();
		}
		return null;
	}
}
