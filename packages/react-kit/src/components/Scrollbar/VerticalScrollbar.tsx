import React from 'react';
import { Scrollbar, SCROLLBAR_TYPE, TScrollbarProps } from './Scrollbar';
import { EVENT_SCROLABLE, SCROLLABLE_CONTEXT_EMITTER } from '../Scrollable/Scrollable.const';
import { PURE } from '../../utils/pure';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';

export const VERTICAL_SCROLLBAR = Symbol('VerticalScrollbar') as symbol;

export type TAdditionalVerticalScrollBarProp = {
	scrollTop?: number;
};

export type TFullVerticalScrollBarProp = TScrollbarProps & TAdditionalVerticalScrollBarProp;

@PURE
export class RawVerticalScrollbar extends Scrollbar<TAdditionalVerticalScrollBarProp> {
	_ratio!: {
		size: number;
		position: number;
	};
	_previousDragCoordinate!: number;
	_minBarSize!: number;

	/**
	 * @returns {Number}
	 * @protected
	 */
	_getMinBarSize() {
		return parseFloat(window.getComputedStyle(this._bar).getPropertyValue('min-height'));
	}

	/**
	 * Hide native scroll
	 * @private
	 */
	_hideNativeScrollContainer() {
		const { width } = this.context.size;
		if (this._container && width) {
			this._container.style.marginRight = `-${width}px`;
			this._container.style.width = `calc(100% + ${width}px)`;
		}
	}

	componentDidMount() {
		super.componentDidMount();
		this._minBarSize = this._getMinBarSize();
		this._hideNativeScrollContainer();
		this._update();

		if (this.props.scrollTop) {
			this._scrollTo(this.props.scrollTop);
		}
	}

	componentWillReceiveProps(newProps: TFullVerticalScrollBarProp) {
		if (this.props.scrollTop !== newProps.scrollTop && newProps.scrollTop) {
			this._scrollTo(newProps.scrollTop);
		}
	}

	_update() {
		this._toggle();
		this._ratio = this._getRatio();
		this._updateBar();
	}

	_toggle() {
		if (this._container) {
			const bounds = this._container.getBoundingClientRect();
			const height = Math.round(bounds.height);
			const scrollHeight = this._container.scrollHeight;
			const isVisible = scrollHeight > height;

			if (isVisible !== this.state.isVisible) {
				this.setState({
					isVisible,
				});

				const emitter = this.context[SCROLLABLE_CONTEXT_EMITTER];
				emitter.emit(EVENT_SCROLABLE.SCROLLBAR_UPDATE, SCROLLBAR_TYPE.VERTICAL, isVisible);
			}
		}
	}

	_updateBar() {
		if (this._container) {
			const visibleHeight = this._container.clientHeight;
			const barHeight = Math.ceil(visibleHeight * this._ratio.size);
			this._bar.style.height = `${barHeight}px`;

			//position
			const scrollTop = this._container.scrollTop;
			const barPositionTop = Math.floor(scrollTop * this._ratio.position);
			this._bar.style.top = `${barPositionTop}px`;
		}
	}

	_getRatio() {
		if (this._container && this._track) {
			const { scrollHeight: scrollSize, clientHeight: containerSize } = this._container;
			const { offsetHeight: trackSize } = this._track;
			const sizeRatio = trackSize / scrollSize;
			const possibleBarSize = containerSize * sizeRatio;
			const barSize = possibleBarSize < this._minBarSize ? this._minBarSize : possibleBarSize;
			const hiddenContentAreaSize = scrollSize - containerSize;
			const hiddenTrackAreaSize = trackSize - barSize;
			const posRatio = hiddenTrackAreaSize / hiddenContentAreaSize;

			return {
				size: sizeRatio,
				position: posRatio,
			};
		} else {
			return {
				size: 0,
				position: 0,
			};
		}
	}

	_scrollTo = (position: number) => {
		if (this._container) {
			this._container.scrollTop = position;
		}
	};

	////////////////////////
	// DOM EVENT HANDLERS //
	////////////////////////

	/**
	 * @param {WheelEvent} event
	 * @protected
	 */
	onTrackMouseWheel = (event: React.WheelEvent<HTMLDivElement>) => {
		if (this._container) {
			this._container.scrollTop += event.deltaY * 10 || event['detail'] * 10 || event['wheelDelta'] * -1;
		}
	};

	/**
	 * @param {MouseEvent} event
	 * @protected
	 */
	onTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (this._track && this._container) {
			const trackPosition =
				this._track.getBoundingClientRect().top + window.pageYOffset - document.documentElement.clientTop;

			this._container.scrollTop = Math.floor((event.clientY - trackPosition) / this._ratio.position);
		}
	};

	/**
	 * @param {MouseEvent} event
	 * @protected
	 */
	onBarDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
		this._previousDragCoordinate = event.clientY;
	};

	/**
	 * @param {MouseEvent} event
	 * @protected
	 */
	onBarDrag = (event: React.MouseEvent<HTMLDivElement>) => {
		if (this._container) {
			const delta = this._previousDragCoordinate - event.clientY;
			this._previousDragCoordinate = event.clientY;
			this._container.scrollTop -= delta / this._ratio.position;
		}
	};
}

export type TVerticalScrollbarProps = PartialKeys<TFullVerticalScrollBarProp, 'theme'>;
export const VerticalScrollbar: React.ComponentClass<TVerticalScrollbarProps> = withTheme(VERTICAL_SCROLLBAR)(
	RawVerticalScrollbar,
);
