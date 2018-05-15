import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ReactElement, EventHandler, MouseEvent, TouchEvent, ComponentClass } from 'react';
import { ObjectClean } from 'typelevel-ts/lib';
import { PartialKeys } from '@devexperts/utils/dist/object/object';

export type THoldableChildProps = {
	onMouseDown: EventHandler<MouseEvent<Element>>,
	onMouseUp: EventHandler<MouseEvent<Element>>,
	onMouseLeave: EventHandler<MouseEvent<Element>>
};

export type TFullHoldableProps = {
	children: ReactElement<THoldableChildProps>,
	onHold: Function,
	delay: number,
	interval: number,
	isDisabled?: boolean
};

class RawHoldable extends React.Component<TFullHoldableProps> {
	static propTypes = {
		children: PropTypes.element,
		delay: PropTypes.number,
		interval: PropTypes.number,
		onHold: PropTypes.func
	};

	private _timeoutId: any;
	private _intervalId: any;

	static defaultProps = {
		interval: 50,
		delay: 300
	};

	componentWillUnmount() {
		this.clearTimers();
	}

	componentDidUpdate(prevProps: TFullHoldableProps) {
		if (!prevProps.isDisabled && this.props.isDisabled) {
			this.clearTimers();
		}
	}

	clearTimers() {
		clearTimeout(this._timeoutId);
		clearInterval(this._intervalId);
	}

	render() {
		const { children } = this.props;
		const { onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd, onTouchCancel } = children.props;

		return React.cloneElement(React.Children.only(children), {
			onMouseDown: (e: MouseEvent<Element>) => {
				this.onStartHold();
				onMouseDown && onMouseDown(e);
			},
			onMouseUp: (e: MouseEvent<Element>) => {
				this.onEndHold();
				onMouseUp && onMouseUp(e);
			},
			onMouseLeave: (e: MouseEvent<Element>) => {
				this.onEndHold();
				onMouseLeave && onMouseLeave(e);
			},
			onTouchStart: (e: TouchEvent<Element>) => {
				this.onStartHold();
				onTouchStart && onTouchStart(e);
			},
			onTouchEnd: (e: TouchEvent<Element>) => {
				this.onEndHold();
				onTouchEnd && onTouchEnd(e);
			},
			onTouchCancel: (e: TouchEvent<Element>) => {
				this.onEndHold();
				onTouchCancel && onTouchCancel(e);
			},
		});
	}

	onStartHold = () => {
		const { interval, delay, onHold } = this.props;

		this.clearTimers();
		this._timeoutId = setTimeout(() => {
			this._intervalId = setInterval(() => {
				onHold && onHold();
			}, interval);
		}, delay);
	}

	onEndHold = () => {
		this.clearTimers();
	}
}

export type THoldableProps = ObjectClean<PartialKeys<TFullHoldableProps, 'delay' | 'interval'>>;
export const Holdable: ComponentClass<THoldableProps> = RawHoldable;
