import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { deepEqual } from '@devexperts/utils/dist/object/object';
import { DragSource, DropTarget } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import debounce from '@devexperts/utils/dist/function/debounce';
import prefix from '@devexperts/utils/dist/dom/prefix';
import { ResizeHandler } from './resize-handler.component';
import { DraggableData, DraggableEvent } from 'react-draggable';
import { withDefaults } from '../../utils/with-defaults';
import { Pure } from '../Pure/Pure';
import { Scrollable } from '../Scrollable/Scrollable';
import { PURE, shouldComponentUpdate } from '../../utils/pure';
import { ResizeDetector } from '../ResizeDetector/ResizeDetector';
import { withTheme } from '../../utils/withTheme';
import {
	ItemSide,
	LAYOUT,
	LAYOUT_THEME,
	LayoutModelItemType,
	LayoutOrientation,
	NATIVE_DRAG_DATA_KEY,
	ResizeHandlerSide,
	TLayoutItem,
	TLayoutModelItem,
	TLayoutModelLayout,
	TLayoutStructure,
	TMinimumLayoutModelItemProps,
} from './layout.constants';

import {
	chooseByOrientation,
	countChildren,
	getMinHeight,
	getMinWidth,
	getPlaceholderPlacement,
	getResizeHandlerSide,
	getSizeMap,
	isEmptyRoot,
	TSizeMap,
} from './layout.utils';

import {
	insertNativeAt,
	insertNativeAtEmptyRoot,
	moveTo,
	reducer,
	remove,
	resize,
	TLayoutAction,
} from './layout.redux';
import DragSourceSpec = __ReactDnd.DragSourceSpec;
import DropTargetSpec = __ReactDnd.DropTargetSpec;
import ConnectDragSource = __ReactDnd.ConnectDragSource;
import ConnectDropTarget = __ReactDnd.ConnectDropTarget;
import ConnectDragPreview = __ReactDnd.ConnectDragPreview;
import DragSourceMonitor = __ReactDnd.DragSourceMonitor;
import DropTargetMonitor = __ReactDnd.DropTargetMonitor;
import { pipe } from 'fp-ts/lib/pipeable';
import { ComponentClass } from 'react';

/**
 * @type {boolean}
 */
let resizeHandlerMouseDown = false;

if (typeof document !== 'undefined') {
	document.addEventListener(
		'mouseup',
		e => {
			resizeHandlerMouseDown = false;
		},
		true,
	);
}

type TItemState = {
	draggingItemId?: string | null;
	resizeStartData?: null | {
		offset: number;
		originalPreviousSize: number;
		originalNextSize: number;
		minPreviousSize: number;
		minNextSize: number;
		previousId: string;
		nextId: string;
	};
	resizeData?: {
		offset: number;
	} | null;
};

type TPlaceholderProps = {
	className?: string;
	fits?: boolean;
	isFull?: boolean;
	isMaximized?: boolean;
	side?: ItemSide;
};

type TRootItemProps<P extends TMinimumLayoutModelItemProps> = {
	node?: any;
	layout: TLayoutStructure<P>;
	sizeMap: TSizeMap;
	theme: LAYOUT_THEME;
	item: TLayoutItem<P>;
	width: number;
	height: number;
	x?: number;
	y?: number;
	resizeHandlerSize: number;
	minItemWidth: number;
	minItemHeight: number;
	isFixed: boolean;
	maximizedId?: string;
	moveItemTo: (id: string, destinationId: string, side: ItemSide) => void;
	insertNativeItemAt: (props: P, id: string, side: ItemSide) => void;
	insertNativeItemAtEmptyRoot: (props: P) => void;
	resizeItems: (id1: string, size1: number, id2: string, size2: number) => void;
	removeItem: (id: string) => void;
	itemPropsFactory: (data: unknown) => P;
	ItemComponent: any;

	Placeholder: React.ComponentClass<TPlaceholderProps> | React.SFC<TPlaceholderProps>;
};

type TDraggableItemProps<P extends TMinimumLayoutModelItemProps> = TRootItemProps<P> & {
	connectDropTarget: ConnectDropTarget;
	connectDragSource: ConnectDragSource;
	connectDragPreview: ConnectDragPreview;

	isOver?: boolean;

	hoverSide?: ItemSide;
	hoverFits: boolean;
};

type TNestedItemProps<P extends TMinimumLayoutModelItemProps> = TRootItemProps<P> & {
	onDragStart: Function;
	onDragEnd: Function;
	onDrop: Function;
	onNativeDrop: (props: P, destinationId: string, side: ItemSide) => void;

	isResizing?: boolean;
};

type TFullItemProps<P extends TMinimumLayoutModelItemProps> = TDraggableItemProps<P> & TNestedItemProps<P>;

class RawItemWithNode extends React.Component<{}, {}> {
	state: any = {};

	componentDidMount() {
		this.setState({
			node: ReactDOM.findDOMNode(this),
		});
	}

	render() {
		const { children } = this.props;
		const { node } = this.state;

		return node ? (React.cloneElement(children as any, { node }) as any) : (children as any);
	}
}

//do not use @PURE
class RawItem<P extends TMinimumLayoutModelItemProps> extends React.Component<TFullItemProps<P>, TItemState> {
	static defaultProps = {
		x: 0,
		y: 0,
	};

	state: TItemState = {
		draggingItemId: null,
		resizeStartData: null,
		resizeData: null,
	};

	_node: Element | Text | null = null;

	shouldComponentUpdate(newProps: any, newState: TItemState) {
		//now we need to remove theme object from original props to avoid checking by shouldComponentUpdate
		const thisPropsCopy = { ...this.props };
		const newPropsCopy = Object.assign({}, newProps);

		delete thisPropsCopy['theme'];
		delete newPropsCopy['theme'];
		delete thisPropsCopy['layout'];
		delete newPropsCopy['layout'];
		delete thisPropsCopy['sizeMap'];
		delete newPropsCopy['sizeMap'];
		//check
		return (
			//either props has changed (ignoring theme and layout which is always new)
			shouldComponentUpdate(thisPropsCopy, this.state, newPropsCopy, newState) ||
			//or theme has changed
			!deepEqual(this.props.theme, newProps.theme)
		);
	}

	componentDidMount() {
		const { item, layout } = this.props;
		if (item.type === LayoutModelItemType.Plain || isEmptyRoot(layout, item)) {
			this._node = ReactDOM.findDOMNode(this);
		}
	}

	componentDidUpdate() {
		const { item, layout } = this.props;
		if (item.type === LayoutModelItemType.Plain || isEmptyRoot(layout, item)) {
			this._node = ReactDOM.findDOMNode(this);
		}
	}

	componentWillReceiveProps(newProps: any, newState: TItemState) {
		if (newProps.item !== this.props.item) {
			this.setState({
				draggingItemId: null,
				resizeStartData: null,
				resizeData: null,
			});
		}
	}

	render() {
		const { item, layout } = this.props;

		switch (item.type) {
			case LayoutModelItemType.Layout: {
				if (isEmptyRoot(layout, item)) {
					return this.renderEmptyRoot();
				} else {
					return this.renderNested(item);
				}
			}
			case LayoutModelItemType.Plain: {
				return this.renderPlain(item);
			}
		}
	}

	renderEmptyRoot() {
		const { width, height, theme, isOver, isFixed, connectDropTarget } = this.props;

		const style = {
			width,
			height,
		};

		const className = classnames(theme.item, theme.item_nested);

		const child = (
			<div className={className} style={style}>
				{isOver && this.renderPlaceholder()}
			</div>
		);

		return !isFixed ? connectDropTarget(child) : child;
	}

	renderNested(item: TLayoutModelLayout) {
		const {
			layout,
			itemPropsFactory,
			width,
			height,
			x,
			y,
			theme,
			resizeItems,
			moveItemTo,
			insertNativeItemAt,
			insertNativeItemAtEmptyRoot,
			removeItem,
			ItemComponent,
			resizeHandlerSize,
			minItemWidth,
			minItemHeight,
			Placeholder,
			isFixed,
			maximizedId,
		} = this.props;

		let {
			sizeMap, //can be changed when dragging and resizing
		} = this.props;
		const { item_ids, orientation } = item;
		const items = item_ids.map(id => layout.items[id]);
		const style = {
			width,
			height,
			...prefix({
				transform: `translate(${x}px, ${y}px)`,
			}),
		};

		const { draggingItemId, resizeStartData, resizeData } = this.state;
		const isResizing = resizeStartData && resizeData;

		if (draggingItemId) {
			//ignore current dragging item in size recalculation
			sizeMap = getSizeMap(
				layout,
				item,
				minItemWidth,
				minItemHeight,
				width,
				height,
				resizeHandlerSize,
				0,
				draggingItemId,
				{
					//note - make a copy!
					...sizeMap,
				},
			);
		} else if (resizeStartData && resizeData) {
			//is resizing - update sizeMap

			const diff = resizeData.offset - resizeStartData.offset;

			const previousSize = sizeMap[resizeStartData.previousId];
			const nextSize = sizeMap[resizeStartData.nextId];
			//make a copy
			sizeMap = {
				...sizeMap,
			};
			switch (orientation) {
				case LayoutOrientation.Vertical: {
					sizeMap = getSizeMap(
						layout,
						layout.items[resizeStartData.previousId],
						minItemWidth,
						minItemHeight,
						previousSize.width,
						previousSize.height + diff,
						resizeHandlerSize,
						0,
						'',
						sizeMap,
					);
					sizeMap = getSizeMap(
						layout,
						layout.items[resizeStartData.nextId],
						minItemWidth,
						minItemHeight,
						nextSize.width,
						nextSize.height - diff,
						resizeHandlerSize,
						0,
						'',
						sizeMap,
					);
					break;
				}
				case LayoutOrientation.Horizontal: {
					sizeMap = getSizeMap(
						layout,
						layout.items[resizeStartData.previousId],
						minItemWidth,
						minItemHeight,
						previousSize.width + diff,
						previousSize.height,
						resizeHandlerSize,
						0,
						'',
						sizeMap,
					);
					sizeMap = getSizeMap(
						layout,
						layout.items[resizeStartData.nextId],
						minItemWidth,
						minItemHeight,
						nextSize.width - diff,
						nextSize.height,
						resizeHandlerSize,
						0,
						'',
						sizeMap,
					);
					break;
				}
			}
		}

		const className = classnames(theme.item, theme.item_nested, {
			[theme.item_horizontal as string]: orientation === LayoutOrientation.Horizontal,
			[theme.item_vertical as string]: orientation === LayoutOrientation.Vertical,
		});

		const sizes = chooseByOrientation(
			() => item_ids.map(id => sizeMap[id].width),
			() => item_ids.map(id => sizeMap[id].height),
			orientation,
		)();

		let offset = 0;
		return (
			<div className={className} style={style}>
				{items.reduce<any>((acc, nestedItem, i) => {
					const itemSize = sizeMap[nestedItem.id];
					const size = chooseByOrientation(itemSize.width, itemSize.height, orientation);
					const isResizingThisItem =
						isResizing &&
						resizeStartData &&
						(nestedItem.id === resizeStartData.previousId || nestedItem.id === resizeStartData.nextId);

					const itemWidth = chooseByOrientation(size, itemSize.width, orientation);
					const itemHeight = chooseByOrientation(itemSize.height, size, orientation);
					//eslint-disable-next-line
					const itemX = chooseByOrientation(offset, void 0, orientation);
					//eslint-disable-next-line
					const itemY = chooseByOrientation(void 0, offset, orientation);
					offset += chooseByOrientation(itemWidth, itemHeight, orientation);

					acc.push(
						<RawItemWithNode key={nestedItem.id}>
							<NestedItem
								sizeMap={sizeMap}
								theme={theme}
								item={nestedItem}
								width={itemWidth}
								height={itemHeight}
								x={itemX}
								y={itemY}
								isResizing={Boolean(isResizingThisItem)}
								resizeHandlerSize={resizeHandlerSize}
								minItemWidth={minItemWidth}
								minItemHeight={minItemHeight}
								onDragStart={this.onNestedItemDragStart}
								onDragEnd={this.onNestedItemDragEnd}
								onDrop={this.onNestedItemDrop}
								onNativeDrop={this.onNativeDrop as any}
								resizeItems={resizeItems}
								moveItemTo={moveItemTo}
								insertNativeItemAt={insertNativeItemAt as any}
								insertNativeItemAtEmptyRoot={insertNativeItemAtEmptyRoot as any}
								removeItem={removeItem}
								ItemComponent={ItemComponent}
								Placeholder={Placeholder}
								itemPropsFactory={itemPropsFactory}
								maximizedId={maximizedId}
								isFixed={isFixed}
								layout={layout}
							/>
						</RawItemWithNode>,
					);

					//add resize handler if needed
					const resizeHandlerSide = getResizeHandlerSide(sizes, i);
					if (resizeHandlerSide === ResizeHandlerSide.Both || resizeHandlerSide === ResizeHandlerSide.After) {
						acc.push(
							<ResizeHandler
								key={`resizeHandler_${i}`}
								onDrag={this.onResizeHandlerDrag}
								onDragStart={this.onResizeHandlerDragStart}
								onDragStop={this.onResizeHandlerDragStop}
								onMouseDown={this.onResizeHandlerMouseDown}
								previousId={nestedItem.id}
								nextId={items[i + 1].id}
								theme={theme}
								offset={offset}
								orientation={orientation}
								isFixed={isFixed}
								size={resizeHandlerSize}
							/>,
						);

						offset += resizeHandlerSize;
					}
					return acc;
				}, [])}
			</div>
		);
	}

	renderPlain(item: TLayoutModelItem<P>) {
		const {
			theme,
			width,
			height,
			isFixed,
			connectDropTarget,
			connectDragSource,
			connectDragPreview,
			ItemComponent,
			isOver,
			x,
			y,
		} = this.props;

		const style = {
			width,
			height,
			...prefix({
				transform: `translate(${x}px, ${y}px)`,
			}),
		};

		const props = {
			...item.props,
			connectDragSource,
		};

		const child = (
			<div className={theme.item} style={style} onDragStart={this.onNativeDragStart}>
				<Pure ItemComponent={ItemComponent} props={props} connectDragSource={connectDragSource}>
					{() => <ItemComponent onRemove={this.onPlainRemove} {...props} />}
				</Pure>
				{isOver && this.renderPlaceholder()}
			</div>
		);

		return !isFixed ? connectDropTarget(connectDragPreview(child)) : child;
	}

	renderPlaceholder() {
		const { theme, layout, item, Placeholder, maximizedId } = this.props;
		const isMaximized = maximizedId === item.id;
		let className = theme.placeholder;
		const { hoverSide, hoverFits } = this.props;
		const emptyRoot = item.type === LayoutModelItemType.Layout && isEmptyRoot(layout, item);
		const fits = emptyRoot || hoverFits;
		const full = emptyRoot;

		if (this._node) {
			if (typeof hoverSide === 'undefined') {
				return null;
			}

			className = classnames(className, {
				[theme.placeholder_fits as string]: fits,
				[theme.placeholder_bottom as string]: hoverSide === ItemSide.Bottom,
				[theme.placeholder_top as string]: hoverSide === ItemSide.Top,
				[theme.placeholder_left as string]: hoverSide === ItemSide.Left,
				[theme.placeholder_right as string]: hoverSide === ItemSide.Right,
				[theme.placeholder_maximized as string]: isMaximized,
				[theme.placeholder_full as string]: full || isMaximized,
			});
		}

		return (
			<Placeholder className={className} side={hoverSide} fits={fits} isFull={full} isMaximized={isMaximized} />
		);
	}

	onPlainRemove = () => {
		const { item, removeItem } = this.props;
		removeItem(item.id);
	};

	onNativeDragStart = (e: any) => {
		if (resizeHandlerMouseDown) {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	onNestedItemDragStart = (item: TLayoutItem<P>) => {
		this.setState({
			draggingItemId: item.id,
		});
	};

	onNestedItemDragEnd = (item: TLayoutItem<P>) => {
		this.setState({
			draggingItemId: null,
		});
	};

	onNestedItemDrop = (itemId: string, destinationId: string, side: ItemSide) => {
		const { moveItemTo } = this.props;
		moveItemTo(itemId, destinationId, side);
	};

	onNativeDrop = (props: P, destinationId: string, side: ItemSide) => {
		const { insertNativeItemAt, itemPropsFactory } = this.props;
		insertNativeItemAt(props, destinationId, side);
	};

	onResizeHandlerMouseDown = () => {
		resizeHandlerMouseDown = true;
	};

	onResizeHandlerDragStart = (previousId: string, nextId: string, e: Event, data: any) => {
		if (this.props.item.type === LayoutModelItemType.Layout) {
			const orientation = this.props.item.orientation;
			const {
				node: { previousSibling, nextSibling },
				x,
				y,
			} = data;
			const previousBounds = previousSibling.getBoundingClientRect();
			const nextBounds = nextSibling.getBoundingClientRect();
			const { minItemWidth, minItemHeight, layout, resizeHandlerSize, item } = this.props;
			const previousItem = layout.items[previousId];
			const previousAmount = countChildren(layout, previousItem, orientation);
			const nextItem = layout.items[nextId];
			const nextAmount = countChildren(layout, nextItem, orientation);

			const previousMinParam =
				orientation === LayoutOrientation.Vertical
					? getMinHeight(previousItem, minItemHeight)
					: getMinWidth(previousItem, minItemWidth);
			const nextMinParam =
				orientation === LayoutOrientation.Vertical
					? getMinHeight(nextItem, minItemHeight)
					: getMinWidth(nextItem, minItemWidth);

			const minPreviousSize = previousMinParam * previousAmount + (previousAmount - 1) * resizeHandlerSize;
			const minNextSize = nextMinParam * nextAmount + (nextAmount - 1) * resizeHandlerSize;

			const newState = {
				resizeData: null,
				resizeStartData: {
					previousId,
					nextId,
					minPreviousSize,
					minNextSize,
					...chooseByOrientation(
						{
							offset: x,
							originalPreviousSize: previousBounds.width,
							originalNextSize: nextBounds.width,
						},
						{
							offset: y,
							originalPreviousSize: previousBounds.height,
							originalNextSize: nextBounds.height,
						},
						orientation,
					),
				},
			};

			this.setState(newState);
		}
	};

	onResizeHandlerDragStop = (e: DraggableEvent, data: DraggableData) => {
		const { resizeStartData, resizeData } = this.state;

		if (resizeData && resizeStartData && resizeData.offset !== resizeStartData.offset) {
			const { layout, resizeItems } = this.props;
			const { previousId, nextId, originalPreviousSize } = resizeStartData;
			const items = layout.items;

			const diff = resizeData.offset - resizeStartData.offset;

			const previous = items[previousId];
			const next = items[nextId];

			const k = (originalPreviousSize + diff) / originalPreviousSize;
			const newPreviousSize = Number((previous.size * k).toFixed(5));
			const newNextSize = previous.size + next.size - newPreviousSize;

			resizeItems(previousId, newPreviousSize, nextId, newNextSize);
		}

		this.setState({
			resizeData: null,
			resizeStartData: null,
		});
	};

	onResizeHandlerDrag = (e: DraggableEvent, data: DraggableData) => {
		if (this.props.item.type === LayoutModelItemType.Layout) {
			const { x, y } = data;
			const { resizeStartData } = this.state;
			if (resizeStartData) {
				const {
					originalPreviousSize,
					originalNextSize,
					minPreviousSize,
					minNextSize,
					offset,
				} = resizeStartData;
				const orientation = this.props.item.orientation;
				const diff = chooseByOrientation(x - offset, y - offset, orientation);
				let newOffset = chooseByOrientation(x, y, orientation);

				const newPreviousSize = originalPreviousSize + diff;
				const newNextSize = originalNextSize - diff;

				if (newPreviousSize < minPreviousSize) {
					//dragged to the left too much, take minimum
					newOffset = offset + minPreviousSize - originalPreviousSize;
				} else if (newNextSize < minNextSize) {
					//dragged to the right too much, take minimum
					newOffset = offset - minNextSize + originalNextSize;
				}

				if (typeof newOffset !== 'undefined' && newOffset !== offset) {
					requestAnimationFrame(() => {
						this.setState({
							resizeData: {
								offset: newOffset,
							},
						});
					});
				}
			}
		}
	};
}

const itemSource: DragSourceSpec<TFullItemProps<TMinimumLayoutModelItemProps>> = {
	beginDrag(props) {
		if (/firefox/i.test(navigator.userAgent)) {
			props.onDragStart(props.item);
		} else {
			setTimeout(() => {
				//setTimeout here because new sizes come to LayoutItems before returning null from dragging
				//if this happens then drag source size is decreased because of increasing other sizes in percents
				//if it is decreased too much then browser thinks that the item is not being dragged because pointer is now
				//out of previous draggable bounds
				props.onDragStart(props.item);
			}, 0);
		}
		return {
			id: props.item.id,
		};
	},
	endDrag(props, monitor: DragSourceMonitor) {
		if (monitor.didDrop()) {
			const result = monitor.getDropResult() as any;
			if (typeof result.side !== 'undefined') {
				//this is for plain items only
				//onRemove for nested layouts is called in LayoutItem
				props.onDrop && props.onDrop(props.item.id, result.item.id, result.side);
			} else {
				props.onDragEnd(props.item);
			}
		} else {
			props.onDragEnd(props.item);
		}
		return {
			id: props.item.id,
		};
	},
	canDrag(props) {
		const { layout, isFixed, maximizedId, item } = props;
		const { root_id, items } = layout;
		const layoutItem = items[root_id] as TLayoutModelLayout;
		const amount = countChildren(layout, layoutItem, layoutItem.orientation);
		const isEnabledDrag = amount > 1 || (amount === 1 && Object.keys(items).length > 2);
		return !isFixed && !props.isResizing && isEnabledDrag && maximizedId !== item.id;
	},
};

const itemTarget: DropTargetSpec<TFullItemProps<TMinimumLayoutModelItemProps>> = {
	hover(props, monitor: DropTargetMonitor, component: any) {
		const canDropResult = monitor.canDrop() as any;
		if (canDropResult && canDropResult.offset && canDropResult.placement) {
			const { fits, side } = canDropResult.placement;
			component.setState({
				hoverSide: side,
				hoverFits: fits,
			} as any);
		}
	},
	drop(props, monitor: DropTargetMonitor, component: any) {
		const isNativeDropAtEmptyRoot =
			props.item.type === LayoutModelItemType.Layout && isEmptyRoot(props.layout, props.item);

		const domNode = ReactDOM.findDOMNode(component) as Element;

		if (domNode === null) {
			return;
		}

		const offset = monitor.getClientOffset();
		const bounds = domNode.getBoundingClientRect();
		//noinspection JSSuspiciousNameCombination
		const placement = getPlaceholderPlacement(
			Math.floor(bounds.left),
			Math.floor(bounds.top),
			Math.floor(bounds.right),
			Math.floor(bounds.bottom),
			offset.x,
			offset.y,
			getMinWidth(props.item, props.minItemWidth),
			getMinHeight(props.item, props.minItemHeight),
			props.maximizedId === props.item.id,
		);
		if (typeof placement.side !== 'undefined' && placement.fits) {
			if (monitor.getItemType() === NativeTypes.TEXT) {
				let data: object | undefined = undefined;
				try {
					data = JSON.parse(monitor.getItem()['text']);
				} catch (e) {}
				if (data) {
					if (typeof data[NATIVE_DRAG_DATA_KEY] !== 'undefined') {
						const itemProps = props.itemPropsFactory(data[NATIVE_DRAG_DATA_KEY]);
						if (isNativeDropAtEmptyRoot) {
							//native drop to empty root
							props.insertNativeItemAtEmptyRoot(itemProps);
						} else {
							//native drop of plain item
							props.onNativeDrop(itemProps, props.item.id, placement.side);
						}
					}
					/* else if (typeof data.item !== 'undefined' && data[SESSION_ID_KEY] !== session.id) {
					 //drop of item from another tab
					 props.onNativeDrop(data.item, props.item.id, side);
					 //try to notify source tab about drop - cannot handle =(
					 // session.send(data[SESSION_ID_KEY], E_LAYOUT.ITEM_DROP, {
					 // 	item: data.item
					 // });

					 //data.item.id is not set here
					 // props.onDrop && props.onDrop(data.item.id, props.item.id, side);
					 }*/
				}
			}
		}
		//this return value is accessed in itemSource.endDrag callback
		return {
			side: placement.fits ? placement.side : undefined,
			item: props.item,
		};
	},
	canDrop(props, monitor: DropTargetMonitor) {
		const emptyRoot = props.item.type === LayoutModelItemType.Layout && isEmptyRoot(props.layout, props.item);

		if (props.item.type === LayoutModelItemType.Plain || emptyRoot) {
			const offset = monitor.getClientOffset();
			if (offset) {
				let placement;
				if (props.node) {
					const bounds = props.node.getBoundingClientRect();
					placement = getPlaceholderPlacement(
						Math.floor(bounds.left),
						Math.floor(bounds.top),
						Math.floor(bounds.right),
						Math.floor(bounds.bottom),
						offset.x,
						offset.y,
						getMinWidth(props.item, props.minItemWidth),
						getMinHeight(props.item, props.minItemHeight),
						props.maximizedId === props.item.id,
					);
				}
				return {
					offset,
					placement,
					isEmptyRoot: emptyRoot,
				} as any;
			}
		}
		return false;
	},
};

const dndKey = 'DRAG_DROP.ITEM';

const Item: ComponentClass<TNestedItemProps<TMinimumLayoutModelItemProps>> = pipe(
	RawItem,
	DragSource(dndKey, itemSource, (connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
	})),
	DropTarget([dndKey, NativeTypes.TEXT], itemTarget, (connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver({
			shallow: true,
		}),
	})),
) as any;

const NestedItem = (Item as any) as React.ComponentClass<TNestedItemProps<TMinimumLayoutModelItemProps>>;
const RootItem = (Item as any) as React.ComponentClass<TRootItemProps<TMinimumLayoutModelItemProps>>;

type TOwnLayoutProps<P extends TMinimumLayoutModelItemProps> = {
	value: TLayoutStructure<P>;
	onChange?: (value: TLayoutStructure<P>) => any;
	debounceResize?: number;
	theme: LAYOUT_THEME;
	maximizedId?: string;
	ItemComponent: any;
};

type TDefaultLayoutProps<P extends TMinimumLayoutModelItemProps> = {
	Scrollable: React.ComponentClass<any>;
	Placeholder: React.ComponentClass<TPlaceholderProps> | React.SFC<TPlaceholderProps>;
	itemPropsFactory: (data: unknown) => P;
	resizeHandlerSize: number;
	minItemWidth: number;
	minItemHeight: number;
	isFixed: boolean;
};

type TFullLayoutProps<P extends TMinimumLayoutModelItemProps> = TOwnLayoutProps<P> & TDefaultLayoutProps<P>;

type TLayoutState = {
	width?: number;
	height?: number;
};

type TLayoutDefaults = 'isFixed' | 'Placeholder' | 'Scrollable';

const layoutDefaults = withDefaults<TFullLayoutProps<TMinimumLayoutModelItemProps>, TLayoutDefaults>({
	isFixed: false,
	Scrollable,
	Placeholder: (props: TPlaceholderProps) => <div className={props.className} />,
});

@PURE
class RawLayout<P extends TMinimumLayoutModelItemProps> extends React.Component<TFullLayoutProps<P>, TLayoutState> {
	onResize!: (element: Element) => any;
	state: TLayoutState = {};

	componentWillMount() {
		const { debounceResize } = this.props;
		this.onResize = debounceResize ? debounce(this.handleResize, debounceResize) : this.handleResize;
	}

	componentWillUpdate(newProps: TFullLayoutProps<P>) {
		const { debounceResize } = newProps;
		if (debounceResize !== this.props.debounceResize) {
			this.onResize = debounceResize ? debounce(this.handleResize, debounceResize) : this.handleResize;
		}
	}

	componentDidMount() {
		this.updateSize();
	}

	render() {
		const { theme, Scrollable } = this.props;
		const { width, height } = this.state;

		const style = {
			width,
			height,
		};

		return (
			<div className={theme.container}>
				{width && height && (
					<div style={style} className={theme.fixedContainer}>
						<Scrollable theme={theme.Scrollable}>{this.renderRoot(width, height)}</Scrollable>
					</div>
				)}
				<ResizeDetector onResize={this.onResize} />
			</div>
		);
	}

	renderRoot(width: number, height: number) {
		const { maximizedId } = this.props;
		return <RawItemWithNode>{this.renderRootItem(width, height, maximizedId)}</RawItemWithNode>;
	}

	renderRootItem = (width: number, height: number, maximizedId?: string) => {
		const {
			theme,
			resizeHandlerSize,
			minItemWidth,
			minItemHeight,
			ItemComponent,
			itemPropsFactory,
			Placeholder,
			isFixed,
		} = this.props;

		let { value } = this.props;

		if (maximizedId) {
			const rootItem = value.items[value.root_id];
			if (rootItem.type === LayoutModelItemType.Plain) {
				return;
			}
			value = {
				root_id: value.root_id,
				items: {
					[value.root_id]: {
						...rootItem,
						item_ids: [maximizedId],
					},
					[maximizedId]: value.items[maximizedId],
				},
			};
		}

		const root = value.items[value.root_id];

		const sizeMap = getSizeMap(
			value,
			value.items[value.root_id],
			minItemWidth,
			minItemHeight,
			width,
			height,
			resizeHandlerSize,
			0,
		);

		return (
			<RootItem
				item={root}
				Placeholder={Placeholder}
				sizeMap={sizeMap}
				ItemComponent={ItemComponent}
				itemPropsFactory={itemPropsFactory}
				layout={value}
				width={sizeMap[root.id].width}
				height={sizeMap[root.id].height}
				resizeHandlerSize={resizeHandlerSize}
				minItemWidth={minItemWidth}
				minItemHeight={minItemHeight}
				theme={theme}
				resizeItems={this.resizeItems}
				insertNativeItemAt={this.insertNativeItemAt as any}
				insertNativeItemAtEmptyRoot={this.insertNativeItemAtEmptyRoot as any}
				removeItem={this.removeItem}
				moveItemTo={this.moveItemTo}
				maximizedId={maximizedId}
				isFixed={isFixed}
			/>
		);
	};

	moveItemTo = (id: string, destinationId: string, side: ItemSide) => {
		this.dispatch(moveTo(id, destinationId, side));
	};

	resizeItems = (id1: string, size1: number, id2: string, size2: number) => {
		this.dispatch(resize(id1, size1, id2, size2));
	};

	insertNativeItemAt = (props: P, id: string, side: ItemSide) => {
		this.dispatch(insertNativeAt(props, id, side));
	};

	insertNativeItemAtEmptyRoot = (props: P) => {
		this.dispatch(insertNativeAtEmptyRoot(props));
	};

	removeItem = (id: string) => {
		this.dispatch(remove(id));
	};

	dispatch = (action: TLayoutAction<P>) => {
		this.props.onChange && this.props.onChange(reducer(this.props.value, action));
	};

	handleResize = () => {
		this.updateSize();
	};

	updateSize() {
		const element = ReactDOM.findDOMNode(this) as HTMLElement;
		const { offsetWidth, offsetHeight } = element;
		this.setState({
			width: offsetWidth,
			height: offsetHeight,
		});
	}
}

export const Layout = withTheme(LAYOUT)(layoutDefaults(RawLayout));
