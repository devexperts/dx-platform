import React from 'react';
import classnames from 'classnames';

import {
	CONTEXT_TYPES,
	EVENT_SCROLABLE,
	SCROLLABLE_CONTEXT_EMITTER,
	ScrollableInternalEmitter,
} from './Scrollable.const';

import { SCROLLBAR_TYPE } from '../Scrollbar/Scrollbar';
import { ResizeDetector as BaseResizeDetector, TResizeDetectorProps } from '../ResizeDetector/ResizeDetector';
import {
	HorizontalScrollbar as BaseHorizontalScrollbar,
	THorizontalScrollbarProps,
} from '../Scrollbar/HorizontalScrollbar';
import { VerticalScrollbar as BaseVerticalScrollbar, TVerticalScrollbarProps } from '../Scrollbar/VerticalScrollbar';

import getScrollbarSize from '../Scrollbar/Scrollbar.util';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { withDefaults } from '../../utils/with-defaults';
import { Children, cloneElement, Component, ComponentClass, MouseEventHandler, ReactElement } from 'react';

export const SCROLLABLE = Symbol('Scrollable') as symbol;

export type TFullScrollableProps = {
	children: ReactElement;
	ResizeDetector: ComponentClass<TResizeDetectorProps>;
	HorizontalScrollbar: ComponentClass<THorizontalScrollbarProps>;
	VerticalScrollbar: ComponentClass<TVerticalScrollbarProps>;
	theme: {
		scrollable?: string;
		withHorizontalScrollbar?: string;
		withVerticalScrollbar?: string;
		scrollbar?: string;
		container: string;
		wrapper?: string;
		content?: string;
		resizeDetector?: string;
		horizontal_scrollbar__bar?: string;
		vertical_scrollbar__bar?: string;
		overlayContent?: string;
	};
	onUpdate?: (withHorizantal: boolean, withVertical: boolean) => void;
	onScroll?: (scrollLeft: number, scrollTop: number) => void;
	scrollTop?: number;
	scrollLeft?: number;
	shouldOverlayContent?: boolean;
};

export type ScrollableState = {
	container?: HTMLDivElement | null;
	scrollable?: HTMLDivElement | null;
};

export class RawScrollable extends Component<TFullScrollableProps, ScrollableState> {
	static childContextTypes: any = CONTEXT_TYPES;

	_withHorizontalScrollbar = false;
	_withVerticalScrollbar = false;
	_container!: HTMLDivElement | null;
	_scrollable!: HTMLDivElement | null;
	_emitter!: ScrollableInternalEmitter;
	_horizontalScrollbar!: HTMLDivElement | null;
	_verticalScrollbar!: HTMLDivElement | null;

	readonly state: ScrollableState = {
		container: void 0, //eslint-disable-line no-void
		scrollable: void 0, //eslint-disable-line no-void
	};

	getChildContext() {
		const { theme } = this.props;
		return {
			size: getScrollbarSize(theme.container as string),
			[SCROLLABLE_CONTEXT_EMITTER.toString()]: this._emitter,
		};
	}

	componentDidMount() {
		this.setState({
			container: this._container,
		});

		this._emitter.on(EVENT_SCROLABLE.SCROLLBAR_UPDATE, this.onScrollbarUpdate);
		this._emitter.on(EVENT_SCROLABLE.SCROLL, this.onScroll);
	}

	componentWillUnmount() {
		this._emitter.off(EVENT_SCROLABLE.SCROLLBAR_UPDATE, this.onScrollbarUpdate);
		this._emitter.off(EVENT_SCROLABLE.SCROLL, this.onScroll);
	}

	componentWillMount() {
		this._emitter = new ScrollableInternalEmitter();
	}

	onScroll: MouseEventHandler<HTMLDivElement> = event => {
		const { scrollLeft, scrollTop } = event.target as HTMLDivElement;
		const { onScroll } = this.props;
		onScroll && onScroll(scrollLeft, scrollTop);
	};

	onScrollbarUpdate = (type: SCROLLBAR_TYPE, isVisible: boolean) => {
		const { onUpdate } = this.props;
		switch (type) {
			case SCROLLBAR_TYPE.VERTICAL: {
				this._withVerticalScrollbar = isVisible;
				break;
			}
			case SCROLLBAR_TYPE.HORIZONTAL: {
				this._withHorizontalScrollbar = isVisible;
				break;
			}
		}
		this.forceUpdate();
		onUpdate && onUpdate(this._withHorizontalScrollbar, this._withVerticalScrollbar);
	};

	render() {
		const { theme, ResizeDetector, VerticalScrollbar, HorizontalScrollbar, shouldOverlayContent } = this.props;

		const children = Children.only(this.props.children);

		const { container } = this.state;

		const className = classnames(
			theme.scrollable,
			{
				[theme.withHorizontalScrollbar as string]: this._withHorizontalScrollbar,
				[theme.withVerticalScrollbar as string]: this._withVerticalScrollbar,
				[theme.overlayContent as string]: shouldOverlayContent,
			},
			(children && children.props && children.props.className) || '',
		);

		const containerClassName = classnames(theme.scrollbar, {
			withBothScrollabars: this._withHorizontalScrollbar && this._withVerticalScrollbar,
		});

		const resizeDetectorProps = {
			theme: {
				container: theme.resizeDetector,
			},
			onResize: this.onResize,
		};

		return (
			<div className={className} ref={el => (this._scrollable = el)}>
				<div className={theme.wrapper}>
					<div className={theme.container} ref={el => (this._container = el)}>
						<div className={theme.content}>
							{cloneElement(children, {
								className: null,
							})}
							<ResizeDetector {...resizeDetectorProps} />
						</div>
					</div>
					{container && [
						<HorizontalScrollbar
							ref={(el: any) => (this._horizontalScrollbar = el)}
							key="horizontalScrollbar"
							container={container}
							scrollLeft={this.props.scrollLeft}
							theme={{
								bar: theme.horizontal_scrollbar__bar,
								container: containerClassName,
							}}
						/>,
						<VerticalScrollbar
							ref={(el: any) => (this._verticalScrollbar = el)}
							key="verticalScrollbar"
							container={container}
							scrollTop={this.props.scrollTop}
							theme={{
								bar: theme.vertical_scrollbar__bar,
								container: containerClassName,
							}}
						/>,
					]}
				</div>
				<ResizeDetector {...resizeDetectorProps} />
			</div>
		);
	}

	onResize = () => {
		this._emitter.emit(EVENT_SCROLABLE.RESIZE);
	};
}

export type TScrollableProps = PartialKeys<
	TFullScrollableProps,
	'theme' | 'ResizeDetector' | 'VerticalScrollbar' | 'HorizontalScrollbar'
>;
export const Scrollable: ComponentClass<TScrollableProps> = withTheme(SCROLLABLE)(
	withDefaults<TFullScrollableProps, 'ResizeDetector' | 'VerticalScrollbar' | 'HorizontalScrollbar'>({
		ResizeDetector: BaseResizeDetector,
		VerticalScrollbar: BaseVerticalScrollbar,
		HorizontalScrollbar: BaseHorizontalScrollbar,
	})(RawScrollable),
);
