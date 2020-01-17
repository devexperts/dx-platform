import React from 'react';
import { Scrollbar, SCROLLBAR_TYPE, TScrollbarProps } from './Scrollbar';

import { EVENT_SCROLABLE, SCROLLABLE_CONTEXT_EMITTER } from '../Scrollable/Scrollable.const';

import { PURE } from '../../utils/pure';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { withTheme } from '../../utils/withTheme';

export const HORIZONTAL_SCROLLBAR = Symbol('HorizontalScrollbar') as symbol;

export type TAdditionalHorizontalProps = {
	scrollLeft?: number;
};

export type TFullHorizontalProps = TScrollbarProps & TAdditionalHorizontalProps;

@PURE
export class RawHorizontalScrollbar extends Scrollbar<TAdditionalHorizontalProps> {
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
		return parseFloat(window.getComputedStyle(this._bar).getPropertyValue('min-width'));
	}

	/**
	 * Hide native scroll
	 * @private
	 */
	_hideNativeScrollContainer() {
		const { container } = this.props;
		const { height } = this.context.size;
		if (height) {
			container.style.marginBottom = `-${height}px`;
			container.style.height = `calc(100% + ${height}px)`;
		}
	}

	componentDidMount() {
		super.componentDidMount();
		this._minBarSize = this._getMinBarSize();
		this._hideNativeScrollContainer();
		this._update();

		if (this.props.scrollLeft) {
			this._scrollTo(this.props.scrollLeft);
		}
	}

	componentWillReceiveProps(newProps: TFullHorizontalProps) {
		if (this.props.scrollLeft !== newProps.scrollLeft) {
			if (newProps.scrollLeft) {
				this._scrollTo(newProps.scrollLeft);
			}
		}
	}

	_update() {
		this._toggle();
		this._ratio = this._getRatio();
		this._updateBar();
	}

	_toggle() {
		const { container } = this.props;
		const bounds = container.getBoundingClientRect();
		const visibleWidth = Math.round(bounds.width);
		const scrollWidth = container.scrollWidth;
		const isVisible = scrollWidth > visibleWidth;
		if (isVisible !== this.state.isVisible) {
			this.setState({
				isVisible,
			});

			const emitter = this.context[SCROLLABLE_CONTEXT_EMITTER];
			emitter.emit(EVENT_SCROLABLE.SCROLLBAR_UPDATE, SCROLLBAR_TYPE.HORIZONTAL, isVisible);
		}
	}

	_updateBar() {
		const { container } = this.props;
		const visibleWidth = container.clientWidth;
		const barWidth = Math.ceil(visibleWidth * this._ratio.size);
		this._bar.style.width = `${barWidth}px`;

		//position
		const scrollLeft = container.scrollLeft;
		const barPositionLeft = Math.floor(scrollLeft * this._ratio.position);
		this._bar.style.left = `${barPositionLeft}px`;
	}

	_getRatio() {
		if (this._container && this._track) {
			const { scrollWidth: scrollSize, clientWidth: containerSize } = this._container;
			const { offsetWidth: trackSize } = this._track;
			const sizeRatio = trackSize / scrollSize;
			const possibleBarSize = containerSize * sizeRatio;
			const barSize = possibleBarSize < this._minBarSize ? this._minBarSize : possibleBarSize;
			const hiddenContentAreaSize = scrollSize - containerSize;
			const hiddenTrackAreaSize = trackSize - barSize;
			const positionRatio = hiddenTrackAreaSize / hiddenContentAreaSize;

			return {
				size: sizeRatio,
				position: positionRatio,
			};
		}

		return {
			size: 0,
			position: 0,
		};
	}

	_scrollTo = (position: number) => {
		if (this._container) {
			this._container.scrollLeft = position;
		}
	};

	////////////////////////
	// DOM EVENT HANDLERS //
	////////////////////////

	/**
	 * @param {WheelEvent} event
	 * @protected
	 */
	onTrackMouseWheel = (event: React.MouseEvent<HTMLDivElement> & { deltaX: number }) => {
		if (this._container) {
			this._container.scrollLeft += event.deltaX * 10 || event['detail'] * 10 || event['wheelDelta'] * -1;
		}
	};

	/**
	 * @param {MouseEvent} event
	 * @protected
	 */
	onTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (this._track && this._container) {
			const trackPosition =
				this._track.getBoundingClientRect().left + window.pageXOffset - document.documentElement.clientLeft;

			this._container.scrollLeft = Math.floor((event.clientX - trackPosition) / this._ratio.position);
		}
	};

	/**
	 * @param {MouseEvent} event
	 * @protected
	 */
	onBarDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
		this._previousDragCoordinate = event.clientX;
	};

	/**
	 * @param {MouseEvent} event
	 * @protected
	 */
	onBarDrag = (event: React.MouseEvent<HTMLDivElement>) => {
		if (this._container) {
			const delta = this._previousDragCoordinate - event.clientX;
			this._previousDragCoordinate = event.clientX;
			this._container.scrollLeft -= delta / this._ratio.position;
		}
	};
}

export type THorizontalScrollbarProps = PartialKeys<TFullHorizontalProps, 'theme'>;
export const HorizontalScrollbar: React.ComponentClass<THorizontalScrollbarProps> = withTheme(HORIZONTAL_SCROLLBAR)(
	RawHorizontalScrollbar,
);
