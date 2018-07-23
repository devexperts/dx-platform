import * as React from 'react';
import * as ReactDOM from 'react-dom';
import prefix from '@devexperts/utils/dist/dom/prefix';
import * as classnames from 'classnames';

import { PURE } from '../../utils/pure';
import { BoundsUpdateDetector } from '../BoundsUpdateDetector/BoundsUpdateDetector';
import throttle from '@devexperts/utils/dist/function/throttle';

import { withTheme } from '../../utils/withTheme';
import { ComponentClass, MouseEventHandler, ReactNode, SyntheticEvent } from 'react';
import { ObjectClean } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { ReactRef } from '../../utils/typings';
import { EventListener } from '../EventListener/EventListener';
import { RootClose } from '../RootClose/RootClose';

type TSize = {
	width: number;
	height: number;
};

export const POPOVER = Symbol('Popover') as symbol;

export enum PopoverPlacement {
	Top = 'Top',
	Bottom = 'Bottom',
	Left = 'Left',
	Right = 'Right',
}

export enum PopoverAlign {
	Top = 'Top',
	Bottom = 'Bottom',
	Left = 'Left',
	Right = 'Right',
	Middle = 'Middle',
	Center = 'Center',
}

export type TFullPopoverProps = {
	children: ReactNode;
	isOpened?: boolean;
	closeOnClickAway?: boolean;
	anchor?: ReactRef;
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
};

type TPopoverState = {
	finalPlacement?: PopoverPlacement;
	finalAlign?: PopoverAlign;
	top?: number;
	left?: number;
	arrowOffset?: number;
};

@PURE
class RawPopover extends React.Component<TFullPopoverProps, TPopoverState> {
	static defaultProps = {
		align: PopoverAlign.Left,
		placement: PopoverPlacement.Bottom,
	};

	state: TPopoverState = {};

	private _needsUpdate = false;
	private _anchor?: Element;
	private _popover: Element;
	private _popoverSize: TSize;
	private rootElement: Element;

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
				const anchorDOMNode = ReactDOM.findDOMNode(this.props.anchor);
				if (!anchorDOMNode || anchorDOMNode instanceof Text) {
					return;
				}
				this._anchor = anchorDOMNode;
			}
			this._popoverSize = this.getPopoverSize();
			this.updatePosition();
		}
	}

	componentWillUnmount() {
		const container = this.props.container || document.body;
		container.removeChild(this.rootElement);
	}

	componentWillReceiveProps(nextProps: TFullPopoverProps) {
		if (nextProps.isOpened && nextProps.anchor) {
			this._needsUpdate = true;
			const anchorDOMNode = ReactDOM.findDOMNode(nextProps.anchor);
			if (!anchorDOMNode || anchorDOMNode instanceof Text) {
				return;
			}
			this._anchor = anchorDOMNode;
		}
	}

	componentDidUpdate(prevProps: TFullPopoverProps) {
		//@PURE check is passed here - update anyway
		if (this._needsUpdate) {
			/** set in {@link componentWillReceiveProps} */
			this._needsUpdate = false;
			this._popoverSize = this.getPopoverSize();
			this.updatePosition();
		}
	}

	render() {
		const { closeOnClickAway, theme, hasArrow, onMouseDown, isOpened, onRequestClose, anchor } = this.props;

		if (!isOpened || !anchor) {
			return null;
		}

		const { top, left, arrowOffset, finalPlacement, finalAlign } = this.state;

		const isMeasured = !!finalAlign && !!finalPlacement;

		let style;
		let popoverClassName = classnames(theme.container);
		if (isMeasured && finalPlacement) {
			style = prefix({
				transform: `translate(${left || 0}px, ${top || 0}px)`,
			});
			popoverClassName = classnames(
				popoverClassName,
				{
					[theme.container_hasArrow as string]: hasArrow,
				},
				[getPlacementModifier(finalPlacement)].map(mod => theme[`container_${mod}`]),
			);
		}
		style = {
			...style,
			...this.props.style,
		};

		let child = (
			<BoundsUpdateDetector onUpdate={this.onSizeUpdate}>
				<div
					ref={(el: any) => (this._popover = el)}
					style={style}
					onMouseDown={onMouseDown}
					onClick={stopPropagation}
					className={popoverClassName}>
					<div className={theme.content}>
						{isMeasured &&
							finalPlacement &&
							finalAlign &&
							hasArrow && (
								<div
									className={theme.arrow}
									style={getArrowStyle(finalPlacement, finalAlign, arrowOffset)}
								/>
							)}
						{this.props.children}
					</div>
				</div>
			</BoundsUpdateDetector>
		);

		if (closeOnClickAway) {
			child = <RootClose onRootClose={onRequestClose}>{child}</RootClose>;
		}

		return (
			<EventListener onResize={this.onResize} onScroll={this.onScroll} target={window}>
				{ReactDOM.createPortal(child, this.rootElement)}
			</EventListener>
		);
	}

	getPopoverSize(): TSize {
		const popover = ReactDOM.findDOMNode(this._popover) as HTMLElement;
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

	updatePosition() {
		if (!this._anchor) {
			return;
		}

		const anchorRect = this._anchor.getBoundingClientRect();
		const { placement, align, hasArrow } = this.props;

		let arrowOffset;
		let finalPlacement;
		let finalAlign;
		const topResult: TVerticalPosition = movePopoverVertically(
			placement,
			align,
			anchorRect.top,
			anchorRect.bottom,
			this._popoverSize.height,
			true,
		)!;
		const leftResult: THorizontalPosition = movePopoverHorizontally(
			placement,
			align,
			anchorRect.left,
			anchorRect.right,
			this._popoverSize.width,
			true,
		)!;

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
	}

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

	onScroll = () => {
		this.handleScroll();
	};

	handleScroll() {
		const { onRequestClose, isOpened } = this.props;
		if (onRequestClose && isOpened) {
			onRequestClose();
		}
	}
}

export type TPopoverProps = ObjectClean<PartialKeys<TFullPopoverProps, 'theme' | 'align' | 'placement'>>;
export const Popover: ComponentClass<TPopoverProps> = withTheme(POPOVER)(RawPopover);

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

type TVerticalPosition = {
	top: number;
	placement: PopoverPlacement;
	align: PopoverAlign;
};

function movePopoverVertically(
	placement: PopoverPlacement,
	align: PopoverAlign,
	anchorTop: number,
	anchorBottom: number,
	popoverHeight: number,
	checkBounds = false,
): TVerticalPosition | undefined {
	switch (placement) {
		case PopoverPlacement.Top: {
			const top = anchorTop - popoverHeight;
			if (checkBounds && top < 0) {
				return movePopoverVertically(PopoverPlacement.Bottom, align, anchorTop, anchorBottom, popoverHeight);
			}
			return {
				top,
				placement,
				align,
			};
		}
		case PopoverPlacement.Bottom: {
			const top = anchorBottom;
			if (checkBounds && top + popoverHeight > window.innerHeight) {
				return movePopoverVertically(PopoverPlacement.Top, align, anchorTop, anchorBottom, popoverHeight);
			}
			return {
				top,
				placement,
				align,
			};
		}
	}

	switch (align) {
		case PopoverAlign.Top: {
			const top = anchorTop;
			if (checkBounds && top + popoverHeight > window.innerHeight) {
				const resultForMiddle = movePopoverVertically(
					placement,
					PopoverAlign.Middle,
					anchorTop,
					anchorBottom,
					popoverHeight,
				);
				if (resultForMiddle && resultForMiddle.top + popoverHeight > window.innerHeight) {
					return movePopoverVertically(
						placement,
						PopoverAlign.Bottom,
						anchorTop,
						anchorBottom,
						popoverHeight,
					);
				}
				return resultForMiddle;
			}
			return {
				top,
				placement,
				align,
			};
		}
		case PopoverAlign.Middle: {
			const top = anchorTop + (anchorBottom - anchorTop) / 2 - popoverHeight / 2;
			if (checkBounds) {
				if (top < 0) {
					return movePopoverVertically(placement, PopoverAlign.Top, anchorTop, anchorBottom, popoverHeight);
				} else if (top + popoverHeight > window.innerHeight) {
					return movePopoverVertically(
						placement,
						PopoverAlign.Bottom,
						anchorTop,
						anchorBottom,
						popoverHeight,
					);
				}
			}
			return {
				top,
				placement,
				align,
			};
		}
		case PopoverAlign.Bottom: {
			const top = anchorBottom - popoverHeight;
			if (checkBounds && top < 0) {
				const resultForMiddle = movePopoverVertically(
					placement,
					PopoverAlign.Middle,
					anchorTop,
					anchorBottom,
					popoverHeight,
				);
				if (resultForMiddle && resultForMiddle.top < 0) {
					return movePopoverVertically(placement, PopoverAlign.Top, anchorTop, anchorBottom, popoverHeight);
				}
				return resultForMiddle;
			}
			return {
				top,
				placement,
				align,
			};
		}
	}

	return undefined;
}

type THorizontalPosition = {
	left: number;
	placement: PopoverPlacement;
	align: PopoverAlign;
};

function movePopoverHorizontally(
	placement: PopoverPlacement,
	align: PopoverAlign,
	anchorLeft: number,
	anchorRight: number,
	popoverWidth: number,
	checkBounds = false,
): THorizontalPosition | undefined {
	switch (placement) {
		case PopoverPlacement.Left: {
			const left = anchorLeft - popoverWidth;
			if (checkBounds && left < 0) {
				return movePopoverHorizontally(PopoverPlacement.Right, align, anchorLeft, anchorRight, popoverWidth);
			}
			return {
				left,
				placement,
				align,
			};
		}
		case PopoverPlacement.Right: {
			const left = anchorRight;
			if (checkBounds && left + popoverWidth > window.innerWidth) {
				return movePopoverHorizontally(PopoverPlacement.Left, align, anchorLeft, anchorRight, popoverWidth);
			}
			return {
				left,
				placement,
				align,
			};
		}
	}

	switch (align) {
		case PopoverAlign.Left: {
			const left = anchorLeft;
			if (checkBounds && left + popoverWidth > window.innerWidth) {
				const resultForCenter = movePopoverHorizontally(
					placement,
					PopoverAlign.Center,
					anchorLeft,
					anchorRight,
					popoverWidth,
				);
				if (resultForCenter && resultForCenter.left + popoverWidth > window.innerWidth) {
					return movePopoverHorizontally(
						placement,
						PopoverAlign.Right,
						anchorLeft,
						anchorRight,
						popoverWidth,
					);
				}
				return resultForCenter;
			}
			return {
				left,
				placement,
				align,
			};
		}
		case PopoverAlign.Center: {
			const left = anchorLeft + (anchorRight - anchorLeft) / 2 - popoverWidth / 2;
			if (checkBounds) {
				if (left < 0) {
					return movePopoverHorizontally(placement, PopoverAlign.Left, anchorLeft, anchorRight, popoverWidth);
				} else if (left + popoverWidth > window.innerWidth) {
					return movePopoverHorizontally(
						placement,
						PopoverAlign.Right,
						anchorLeft,
						anchorRight,
						popoverWidth,
					);
				}
			}
			return {
				left,
				placement,
				align,
			};
		}
		case PopoverAlign.Right: {
			const left = anchorRight - popoverWidth;
			if (checkBounds && left < 0) {
				const resultForCenter = movePopoverHorizontally(
					placement,
					PopoverAlign.Center,
					anchorLeft,
					anchorRight,
					popoverWidth,
				);
				if (resultForCenter && resultForCenter.left < 0) {
					return movePopoverHorizontally(placement, PopoverAlign.Left, anchorLeft, anchorRight, popoverWidth);
				}
				return resultForCenter;
			}
			return {
				left,
				placement,
				align,
			};
		}
	}

	return undefined;
}

function getPlacementModifier(placement: PopoverPlacement): string {
	switch (placement) {
		case PopoverPlacement.Bottom: {
			return 'placementBottom';
		}
		case PopoverPlacement.Top: {
			return 'placementTop';
		}
		case PopoverPlacement.Left: {
			return 'placementLeft';
		}
		case PopoverPlacement.Right: {
			return 'placementRight';
		}
	}
}
