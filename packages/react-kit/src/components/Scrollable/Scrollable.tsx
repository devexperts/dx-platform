import * as React from 'react';
import classnames from 'classnames';

import {
	CONTEXT_TYPES,
	EVENT_SCROLABLE,
	SCROLLABLE_CONTEXT_EMITTER,
	ScrollableInternalEmitter
} from './Scrollable.const';

import { SCROLLBAR_TYPE } from '../Scrollbar/Scrollbar';
import { ResizeDetector as BaseResizeDetector, TResizeDetectorProps } from '../ResizeDetector/ResizeDetector';
import {HorizontalScrollbar as BaseHorizontalScrollbar, THorizontalScrollbarProps} from '../Scrollbar/HorizontalScrollbar';
import {VerticalScrollbar as BaseVerticalScrollbar, TVerticalScrollbarProps} from '../Scrollbar/VerticalScrollbar';

import getScrollbarSize from '../Scrollbar/Scrollbar.util';
import * as PropTypes from 'prop-types';
import {withTheme} from '../../utils/withTheme';
import {ObjectClean} from 'typelevel-ts';
import {PartialKeys} from '@devexperts/utils/lib/object/object';

export const SCROLLABLE = Symbol('Scrollable');

export type TFullScrollableProps = {
    children: React.ReactNode,
    ResizeDetector: React.ComponentClass<TResizeDetectorProps>,
    HorizontalScrollbar: React.ComponentClass<THorizontalScrollbarProps>,
    VerticalScrollbar: React.ComponentClass<TVerticalScrollbarProps>,
	theme: {
		scrollable?: string
		withHorizontalScrollbar?: string
		withVerticalScrollbar?: string
		scrollbar?: string
		container: string
		wrapper?: string
		content?: string
		resizeDetector?: string
		horizontal_scrollbar__bar?: string
		vertical_scrollbar__bar?: string
	}
    onUpdate?: (withHorizantal: boolean, withVertical: boolean) => void,
    onScroll?: (scrollLeft: number, scrollTop: number) => void,
    scrollTop?: number,
    scrollLeft?: number
}

export class RawScrollable extends React.Component<TFullScrollableProps> {
	static defaultProps = {
		ResizeDetector: BaseResizeDetector,
		VerticalScrollbar: BaseVerticalScrollbar,
		HorizontalScrollbar: BaseHorizontalScrollbar
	};

	static childContextTypes = CONTEXT_TYPES;

	_withHorizontalScrollbar = false;
	_withVerticalScrollbar = false;
	_container: HTMLDivElement | null;
	_scrollable: HTMLDivElement | null;
	_emitter: ScrollableInternalEmitter;
    _horizontalScrollbar: HTMLDivElement | null;
    _verticalScrollbar: HTMLDivElement | null;

	state = {
		container: (void 0), //eslint-disable-line no-void
		scrollable: (void 0), //eslint-disable-line no-void
	}

	getChildContext() {
		const { theme } = this.props;
		return {
			size: getScrollbarSize(theme.container as string),
			[SCROLLABLE_CONTEXT_EMITTER.toString()]: this._emitter
		};
	}

	componentDidMount() {
		this.setState({
			container: this._container
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

	onScroll = (event: React.MouseEvent<HTMLDivElement>) => {
		const { scrollLeft, scrollTop } = event.target as any;
		const { onScroll } = this.props;
		onScroll && onScroll(scrollLeft, scrollTop);
	}

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
	}

	render() {
		const {
			theme,
			ResizeDetector,
			VerticalScrollbar,
			HorizontalScrollbar
		} = this.props;

		const children = React.Children.only(this.props.children);

		const { container } = this.state;

		const className = classnames(theme.scrollable, {
			[theme.withHorizontalScrollbar as string]: this._withHorizontalScrollbar,
			[theme.withVerticalScrollbar as string]: this._withVerticalScrollbar
		}, children.props.className || '');

		const containerClassName = classnames(theme.scrollbar, {
			withBothScrollabars: this._withHorizontalScrollbar && this._withVerticalScrollbar
		});

		const resizeDetectorProps = {
			theme: {
				container: theme.resizeDetector
			},
			onResize: this.onResize
		};

		return (
			<div className={className} ref={el => this._scrollable = el}>
				<div className={theme.wrapper}>
					<div className={theme.container} ref={el => this._container = el}>
						<div className={theme.content}>
							{React.cloneElement(children, {
								className: null
							})}
							<ResizeDetector {...resizeDetectorProps} />
						</div>
					</div>
					{container && [
						<HorizontalScrollbar ref={(el: any) => this._horizontalScrollbar = el}
							key="horizontalScrollbar"
							container={container}
							scrollLeft={this.props.scrollLeft}
							theme={{
								bar: theme.horizontal_scrollbar__bar,
								container: containerClassName
							}} />,
						<VerticalScrollbar ref={(el: any) => this._verticalScrollbar = el}
							key="verticalScrollbar"
							container={container}
							scrollTop={this.props.scrollTop}
							theme={{
								bar: theme.vertical_scrollbar__bar,
								container: containerClassName
							}} />
					]}
				</div>
				<ResizeDetector {...resizeDetectorProps} />
			</div>
		);
	}

	onResize = () => {
		this._emitter.emit(EVENT_SCROLABLE.RESIZE);
	}
}

export type TScrollableProps = ObjectClean<PartialKeys<TFullScrollableProps,
	| 'theme'
	| 'ResizeDetector'
	| 'VerticalScrollbar'
	| 'HorizontalScrollbar'>>;
export const Scrollable: React.ComponentClass<TScrollableProps> = withTheme(SCROLLABLE)(RawScrollable);