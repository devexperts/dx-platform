import * as React from 'react';
import { ComponentClass, PureComponent, ReactElement } from 'react';
import { ObjectClean } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/lib/object/object';

export type TRawDeferredProps = {
	render: () => ReactElement<any>,
	children?: ReactElement<any>,
	delay: number
};

type TDeferredState = {
	isResolved: boolean
};

class RawDeferred extends PureComponent<TRawDeferredProps, TDeferredState> {
	static defaultProps = {
		delay: 0
	};

	readonly state = {
		isResolved: false
	};

	private timeout: number;

	componentWillMount() {
		this.delay();
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	componentWillUpdate() {
		console.log('update');
		clearTimeout(this.timeout);
		this.delay();
	}

	render() {
		const { isResolved } = this.state;
		const { render, children } = this.props;
		return isResolved ? render() : (children || null) as null; //weird React typings...
	}

	private delay() {
		this.timeout = window.setTimeout(() => {
			this.setState({
				isResolved: true
			});
		}, this.props.delay);
	}
}

export type TDeferredProps = ObjectClean<PartialKeys<TRawDeferredProps, 'delay'>>;
export const Deferred: ComponentClass<TDeferredProps> = RawDeferred;