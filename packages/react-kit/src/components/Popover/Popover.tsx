import React, { createRef, PropsWithChildren, RefObject } from 'react';
import ReactDOM from 'react-dom';
import prefix from '@devexperts/platform-utils/dist/dom/prefix';
import classnames from 'classnames';

import { PURE } from '../../utils/pure';
import { BoundsUpdateDetector } from '../BoundsUpdateDetector/BoundsUpdateDetector';
import throttle from '@devexperts/platform-utils/dist/function/throttle';

import { withTheme } from '../../utils/withTheme';
import { ComponentClass, MouseEventHandler, SyntheticEvent } from 'react';
import { PartialKeys } from '@devexperts/platform-utils/dist/object/object';
import { EventListener } from '../EventListener/EventListener';
import { withDefaults } from '../../utils/with-defaults';
import {
	PopoverPlacement,
	PopoverAlign,
	movePopoverVertically,
	TVerticalPosition,
	THorizontalPosition,
	movePopoverHorizontally,
	getPlacementModifier,
	isNode,
} from './Popover.model';
export { PopoverPlacement, PopoverAlign } from './Popover.model';

type TSize = {
	width: number;
	height: number;
};

export const POPOVER = Symbol('Popover') as symbol;

export type TFullPopoverProps = PropsWithChildren<{
	isOpened?: boolean;
	closeOnClickAway?: boolean;
	disableCloseOnScroll?: boolean;
	anchor?: RefObject<Element>;
	onMouseDown?: MouseEventHandler<Element>;
	placement: PopoverPlacement;
	align: PopoverAlign;
	container?: Element;
	onRequestClose?: () => any;
	hasArrow?: boolean;
	theme: {
		container?: string;
		container_hasArrow?: string;
		container_placementTop?: string;
		container_placementBottom?: string;
		container_placementLeft?: string;
		container_placementRight?: string;
		content?: string;
		arrow?: string;
	};
	style?: object;
}>;

type TPopoverState = {
	finalPlacement?: PopoverPlacement;
	finalAlign?: PopoverAlign;
	top?: number;
	left?: number;
	arrowOffset?: number;
};

type AnchorProperties = {
	left: number;
	right: number;
	top: number;
	bottom: number;
	width: number;
	parentWidth: number;
	parentHeight: number;
};

@PURE
class RawPopover extends React.Component<TFullPopoverProps, TPopoverState> {
	readonly state: TPopoverState = {};

	private _needsUpdate = false;
	private _anchor = createRef<Element>();
	private _popover = createRef<HTMLDivElement>();
	private _popoverSize!: TSize;
	private rootElement!: Element;
	private mediaQueryList?: MediaQueryList;

	constructor(props: TFullPopoverProps) {
		super(props);

		this.rootElement = document.createElement('div');
		const container = props.container || document.body;
		container.appendChild(this.rootElement);

		this.handleResize = throttle(this.handleResize, 100);
		this.handleScroll = throttle(this.handleScroll, 100);
	}

	componentDidMount() {
		if (this.props.isOpened) {
			if (this.props.anchor) {
				const anchorDOMNode = this.props.anchor;
				if (!anchorDOMNode || anchorDOMNode instanceof Text) {
					return;
				}
				this._anchor = anchorDOMNode;
			}
			this._popoverSize = this.getPopoverSize();
			this.updatePosition();
		}

		if (window.matchMedia) {
			this.mediaQueryList = window.matchMedia('print');
			this.mediaQueryList.addListener(() => this.updatePosition());
		}

		window['onbeforeprint'] = this.updatePosition;
		window['onafterprint'] = this.updatePosition;

		document.addEventListener('click', this.handleDocumentClick, { capture: true });
	}

	componentWillUnmount() {
		const container = this.props.container || document.body;
		container.removeChild(this.rootElement);
		this.mediaQueryList && this.mediaQueryList.removeListener(this.updatePosition);
		window['onbeforeprint'] = null;
		window['onafterprint'] = null;

		document.removeEventListener('click', this.handleDocumentClick);
	}

	componentDidUpdate(prevProps: TFullPopoverProps) {
		this.setAnchor(this.props);

		if (this.props.isOpened && this._needsUpdate) {
			this._needsUpdate = false;
			this._popoverSize = this.getPopoverSize();
			this.updatePosition();
		}
	}

	render() {
		const { theme, hasArrow, onMouseDown, isOpened, anchor } = this.props;

		if (!isOpened || !anchor) {
			return null;
		}

		const { top, left, arrowOffset, finalPlacement, finalAlign } = this.state;

		const isMeasured = !!finalAlign && !!finalPlacement;

		let style;
		let popoverClassName = classnames(theme.container);
		if (isMeasured && finalPlacement) {
			const placementModifier = getPlacementModifier(finalPlacement);
			const placementClass = theme[`container_${placementModifier}`];

			style = prefix({
				transform: `translate(${left || 0}px, ${top || 0}px)`,
			});
			popoverClassName = classnames(
				popoverClassName,
				{
					[theme.container_hasArrow as string]: hasArrow,
				},
				placementClass,
			);
		}
		style = {
			...style,
			...this.props.style,
		};

		const target = typeof window !== 'undefined' ? window : 'window';

		return (
			<EventListener onResize={this.onResize} onScrollCapture={this.onScroll} target={target}>
				{ReactDOM.createPortal(
					<BoundsUpdateDetector
						// TODO: ref as function returns BoundsUpdateDetector(?)
						// @ts-ignore
						ref={this._popover}
						onUpdate={this.onSizeUpdate}>
						<div
							ref={this._popover}
							style={style}
							onMouseDown={onMouseDown}
							onClick={stopPropagation}
							className={popoverClassName}>
							<div className={theme.content}>
								{isMeasured && finalPlacement && finalAlign && hasArrow && (
									<div
										className={theme.arrow}
										style={getArrowStyle(finalPlacement, finalAlign, arrowOffset)}
									/>
								)}
								{this.props.children}
							</div>
						</div>
					</BoundsUpdateDetector>,
					this.rootElement,
				)}
			</EventListener>
		);
	}
	private handleDocumentClick = (e: MouseEvent) => {
		const { onRequestClose, closeOnClickAway } = this.props;
		if (isNode(e.target) && !this.rootElement.contains(e.target) && closeOnClickAway && onRequestClose) {
			onRequestClose();
		}
	};

	setAnchor(props: TFullPopoverProps) {
		if (props.isOpened && props.anchor) {
			this._needsUpdate = true;
			const anchorDOMNode = props.anchor.current;
			if (!anchorDOMNode || anchorDOMNode instanceof Text) {
				return;
			}
			this._anchor = props.anchor;
		}
	}

	getPopoverSize(): TSize {
		const popover = this._popover.current;
		if (popover instanceof HTMLElement) {
			return {
				height: popover.offsetHeight,
				width: popover.offsetWidth,
			};
		}
		return {
			height: 0,
			width: 0,
		};
	}

	private getAnchorProperties(): AnchorProperties | undefined {
		const container = this.props.container;
		const anchor = this._anchor.current;

		if (container && anchor) {
			const containerRect = container.getBoundingClientRect();
			const anchorRect = anchor.getBoundingClientRect();

			return {
				left: anchorRect.left - containerRect.left,
				right: anchorRect.right - containerRect.left,
				top: anchorRect.top - containerRect.top,
				bottom: anchorRect.bottom - containerRect.top,
				width: anchorRect.width,
				parentWidth: containerRect.width,
				parentHeight: containerRect.height,
			};
		} else if (anchor) {
			const anchorRect = anchor.getBoundingClientRect();

			return {
				left: anchorRect.left,
				right: anchorRect.right,
				top: anchorRect.top,
				bottom: anchorRect.bottom,
				width: anchorRect.width,
				parentWidth: window.innerWidth,
				parentHeight: window.innerHeight,
			};
		} else {
			return;
		}
	}

	updatePosition = () => {
		const anchorRect = this.getAnchorProperties();

		if (!anchorRect) {
			return;
		}

		const { placement, align, hasArrow } = this.props;

		let arrowOffset;
		let finalPlacement;
		let finalAlign;
		const topResult: TVerticalPosition = movePopoverVertically({
			placement,
			align,
			anchorTop: anchorRect.top,
			anchorBottom: anchorRect.bottom,
			popoverHeight: this._popoverSize.height,
			parentHeight: anchorRect.parentHeight,
			checkBounds: true,
		})!;

		const leftResult: THorizontalPosition = movePopoverHorizontally({
			placement,
			align,
			anchorLeft: anchorRect.left,
			anchorRight: anchorRect.right,
			popoverWidth: this._popoverSize.width,
			parentWidth: anchorRect.parentWidth,
			checkBounds: true,
		})!;

		//additional
		if (placement === PopoverPlacement.Top || placement === PopoverPlacement.Bottom) {
			finalPlacement = topResult.placement;
			finalAlign = leftResult.align;
			if (hasArrow) {
				//horizontal arrow offset
				arrowOffset = Math.round((anchorRect.right - anchorRect.left) / 2);
			}
		} else if (placement === PopoverPlacement.Left || placement === PopoverPlacement.Right) {
			finalPlacement = leftResult.placement;
			finalAlign = topResult.align;
			if (hasArrow) {
				//vertical arrow offset
				arrowOffset = Math.round((anchorRect.bottom - anchorRect.top) / 2);
			}
		}

		this.setState({
			top: Math.round(topResult.top) + window.pageYOffset,
			left: Math.round(leftResult.left) + window.pageXOffset,
			finalPlacement,
			finalAlign,
			arrowOffset,
		});
	};

	onSizeUpdate = (newSize: TSize) => {
		this._popoverSize = newSize;
		this.updatePosition();
	};

	onResize = () => {
		this.handleResize();
	};

	handleResize() {
		this.updatePosition();
	}

	private onScroll = (event: UIEvent) => {
		if (this._anchor && this._popover && event.target) {
			const popoverNode = this._popover.current;
			const scrolled = event.target as Node;
			if (popoverNode && scrolled.contains(this._anchor.current)) {
				this.handleScroll();
			}
		}
	};

	handleScroll() {
		const { onRequestClose, isOpened, disableCloseOnScroll } = this.props;
		if (onRequestClose && isOpened && !disableCloseOnScroll) {
			onRequestClose();
		}
	}
}

export type TPopoverProps = PartialKeys<TFullPopoverProps, 'theme' | 'align' | 'placement'>;
export const Popover: ComponentClass<TPopoverProps> = withTheme(POPOVER)(
	withDefaults<TFullPopoverProps, 'align' | 'placement'>({
		align: PopoverAlign.Left,
		placement: PopoverPlacement.Bottom,
	})(RawPopover),
);

function stopPropagation<T>(e: SyntheticEvent<T>) {
	e.stopPropagation();
}

function getArrowStyle(placement: PopoverPlacement, align: PopoverAlign, offset?: number): {} | undefined {
	switch (placement) {
		case PopoverPlacement.Top: //fallthrough
		case PopoverPlacement.Bottom: {
			switch (align) {
				case PopoverAlign.Left: {
					return prefix({
						left: offset,
						transform: 'translateX(-50%)',
					});
				}
				case PopoverAlign.Center: {
					return prefix({
						left: '50%',
						transform: 'translateX(-50%)',
					});
				}
				case PopoverAlign.Right: {
					return prefix({
						right: offset,
						transform: 'translateX(50%)',
					});
				}
			}
			break;
		}
		case PopoverPlacement.Left: //fallthrough
		case PopoverPlacement.Right: {
			switch (align) {
				case PopoverAlign.Top: {
					return prefix({
						top: offset,
						transform: 'translateY(-50%)',
					});
				}
				case PopoverAlign.Middle: {
					return prefix({
						top: '50%',
						transform: 'translateY(-50%)',
					});
				}
				case PopoverAlign.Bottom: {
					return prefix({
						bottom: offset,
						transform: 'translateY(50%)',
					});
				}
			}
		}
	}

	return undefined;
}
