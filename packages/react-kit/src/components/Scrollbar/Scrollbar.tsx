import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { Bar } from './Bar';

import { CONTEXT_TYPES, EVENT_SCROLABLE, SCROLLABLE_CONTEXT_EMITTER } from '../Scrollable/Scrollable.const';

export const SCROLLBAR = Symbol('Scrollbar') as symbol;
export enum SCROLLBAR_TYPE {
	HORIZONTAL = 'HORIZONTAL',
	VERTICAL = 'VERTICAL',
}

export type TScrollbarProps = {
	container: HTMLDivElement;
	theme: {
		container?: string;
		containerIsVisible?: string;
		track?: string;
		bar?: string;
	};
};

export type TScrollbarState = {
	isVisible: boolean;
};

export class Scrollbar<T> extends React.Component<TScrollbarProps & T, TScrollbarState> {
	_scrollbar!: HTMLDivElement | null;
	_container: HTMLDivElement | null;
	_track!: HTMLDivElement | null;
	_bar!: HTMLDivElement;

	static contextTypes: any = CONTEXT_TYPES;

	state = {
		isVisible: false,
	};

	constructor(props: TScrollbarProps & T, context: any) {
		super(props, context);
		const { container } = this.props;
		this._container = container;
	}

	componentDidMount() {
		const emitter = this.context[SCROLLABLE_CONTEXT_EMITTER];
		emitter.on(EVENT_SCROLABLE.RESIZE, this.onResize);
		if (this._container) {
			this._container.addEventListener('scroll', this._onContainerScroll);
		}
	}

	componentWillUnmount() {
		const emitter = this.context[SCROLLABLE_CONTEXT_EMITTER];
		emitter.off(EVENT_SCROLABLE.RESIZE, this.onResize);
		if (this._container) {
			this._container.removeEventListener('scroll', this._onContainerScroll);
		}
	}

	render() {
		const { theme } = this.props;

		const { isVisible } = this.state;

		const className = classnames(theme.container, {
			[theme.containerIsVisible as string]: isVisible,
		});

		const barProps = {
			theme: {
				container: theme.bar,
			},
			onBarDragStart: this.onBarDragStart,
			onBarDrag: this.onBarDrag,
		};

		return (
			<div className={className} ref={el => (this._scrollbar = el)}>
				<div
					className={theme.track}
					onWheel={this.onTrackMouseWheel}
					onClick={this.onTrackClick}
					ref={el => (this._track = el)}>
					<Bar {...barProps} ref={(el: Bar) => (this._bar = ReactDOM.findDOMNode(el) as HTMLDivElement)} />
				</div>
			</div>
		);
	}

	_updateBar() {}

	_update() {}

	/**
	 * @param {Event} event
	 * @private
	 */
	_onContainerScroll = (event: any) => {
		this._updateBar();
		const emitter = this.context[SCROLLABLE_CONTEXT_EMITTER];
		emitter.emit(EVENT_SCROLABLE.SCROLL, event);
	};

	onResize = () => {
		this._update();
	};

	////////////////////////
	// DOM EVENT HANDLERS //
	////////////////////////

	/**
	 * @abstract
	 * @param {WheelEvent} event
	 * @protected
	 */
	onTrackMouseWheel = (event: React.WheelEvent<HTMLDivElement>) => {};

	/**
	 * @abstract
	 * @param {MouseEvent} event
	 * @protected
	 */
	onTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {};

	/**
	 * @abstract
	 * @param {MouseEvent} event
	 * @protected
	 */
	onBarDragStart = (event: React.MouseEvent<HTMLDivElement>) => {};

	/**
	 * @abstract
	 * @param {MouseEvent} event
	 * @protected
	 */
	onBarDrag = (event: React.MouseEvent<HTMLDivElement>) => {};
}
