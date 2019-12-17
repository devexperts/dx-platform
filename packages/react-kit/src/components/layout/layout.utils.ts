import {
	ItemSide,
	LayoutModelItemType,
	LayoutOrientation,
	NATIVE_DRAG_DATA_KEY,
	ResizeHandlerSide,
	TDenormalizedLayout,
	TLayoutItem,
	TLayoutModelItem,
	TLayoutModelLayout,
	TLayoutStructure,
	TMinimumLayoutModelItemProps,
} from './layout.constants';
import { uuid } from '@devexperts/utils/dist/string/string';

const getSum = (items: Array<number>): number => {
	if (items.length === 0) {
		return 0;
	}
	return items.reduce((acc, item) => acc + item);
};

export function fixFloatSizes(sizes: number[], sum: number, precision: number): number[] {
	//increase the last size if average value is not integer
	//for example for 3 items average size is 33.33...% and the last will be 33.34...%
	//33.33...% + 33.33...% + 33.34...% === 100%

	const sizesSum = Number(getSum(sizes).toFixed(precision));
	if (sizesSum > sum) {
		return sizes.map(size => Number(size.toFixed(precision)));
	} else {
		let lastSizeIndex;
		for (lastSizeIndex = sizes.length - 1; lastSizeIndex >= 0; lastSizeIndex--) {
			if (sizes[lastSizeIndex] !== 0) {
				break;
			}
		}
		if (lastSizeIndex === -1) {
			//all zeros - return a copy
			return sizes.slice();
		}

		const head = sizes.slice(0, lastSizeIndex).map(size => Number(size.toFixed(precision)));
		const tail = sizes.slice(lastSizeIndex + 1);
		const inserted = Number((sum - getSum(head)).toFixed(precision));
		return head.concat(inserted, tail);
	}
}

export type TPlaceholderPlacement = {
	side?: ItemSide;
	fits: boolean;
};
export function getPlaceholderPlacement(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	x: number,
	y: number,
	minWidth: number,
	minHeight: number,
	isMaximized: boolean,
): TPlaceholderPlacement {
	//check bounds
	const isOutOfBounds =
		x1 === x2 ||
		y1 === y2 ||
		(x1 < x2 && (x < x1 || x > x2)) ||
		(x2 < x1 && (x < x2 || x > x1)) ||
		(y1 < y2 && (y < y1 || y > y2)) ||
		(y2 < y1 && (y < y2 || y > y1));

	if (!isOutOfBounds) {
		const width = Math.abs(x2 - x1);
		const cx = Math.min(x1, x2) + width / 2;
		const height = Math.abs(y2 - y1);
		const cy = Math.min(y1, y2) + height / 2;
		const k = (y2 - y1) / (x2 - x1);

		//shift coords to (0;0)
		const sx = x - cx;
		const sy = y - cy;

		const doubleMinWidth = minWidth * 2;
		const doubleMinHeight = minHeight * 2;

		const isTop = (sx < 0 && sy <= k * sx) || (sx >= 0 && sy <= -k * sx);
		const isBottom = (sx < 0 && sy >= -k * sx) || (sx >= 0 && sy >= k * sx);
		const isLeft = sx < 0 && sy > k * sx && sy < -k * sx;
		const isRight = sx > 0 && sy > -k * sx && sy < k * sx;

		//vertical axis has higher priority
		if (isTop) {
			return {
				side: ItemSide.Top,
				fits: !isMaximized && width >= minWidth && height >= doubleMinHeight,
			};
		}
		if (isBottom) {
			return {
				side: ItemSide.Bottom,
				fits: !isMaximized && width >= minWidth && height >= doubleMinHeight,
			};
		}
		if (isLeft) {
			return {
				side: ItemSide.Left,
				fits: !isMaximized && height >= minHeight && width >= doubleMinWidth,
			};
		}
		if (isRight) {
			return {
				side: ItemSide.Right,
				fits: !isMaximized && height >= minHeight && width >= doubleMinWidth,
			};
		}
	}

	return {
		fits: false,
	};
}

export function invalidateParents<P extends TMinimumLayoutModelItemProps>(
	items: Record<string, TLayoutItem<P>>,
	fromId: string,
): Record<string, TLayoutItem<P>> {
	const parent = items[items[fromId].parent_id];
	if (parent) {
		return invalidateParents(
			{
				...items,
				[parent.id]: {
					...parent,
				},
			},
			parent.id,
		);
	} else {
		return items;
	}
}

export function generateWrapperLayout(
	id: string,
	destination: TLayoutItem<TMinimumLayoutModelItemProps>,
	parent: TLayoutModelLayout,
	side: ItemSide,
): TLayoutModelLayout {
	const result = {
		id: uuid(),
		size: destination.size,
		parent_id: parent.id,
	};
	switch (side) {
		case ItemSide.Top: {
			return {
				...result,
				type: LayoutModelItemType.Layout,
				orientation: LayoutOrientation.Vertical,
				item_ids: [id, destination.id],
			};
		}
		case ItemSide.Bottom: {
			return {
				...result,
				type: LayoutModelItemType.Layout,
				orientation: LayoutOrientation.Vertical,
				item_ids: [destination.id, id],
			};
		}
		case ItemSide.Left: {
			return {
				...result,
				type: LayoutModelItemType.Layout,
				orientation: LayoutOrientation.Horizontal,
				item_ids: [id, destination.id],
			};
		}
		case ItemSide.Right: {
			return {
				...result,
				type: LayoutModelItemType.Layout,
				orientation: LayoutOrientation.Horizontal,
				item_ids: [destination.id, id],
			};
		}
	}
}

export function flattenLayoutItems<P extends TMinimumLayoutModelItemProps>(
	items: Record<string, TLayoutItem<P>>,
	fromId: string,
): Record<string, TLayoutItem<P>> {
	const from = items[fromId];

	switch (from.type) {
		case LayoutModelItemType.Plain: {
			//plain item - nothing to flattenLayoutItems
			return items;
		}
		case LayoutModelItemType.Layout: {
			if (!from.parent_id) {
				//root - just traverse children
				return from.item_ids.reduce(flattenLayoutItems, items);
			}

			//nested layout
			const amount = from.item_ids.length;
			switch (amount) {
				case 0: {
					//empty nested layout - remove it
					const parent = items[from.parent_id];
					switch (parent.type) {
						case LayoutModelItemType.Layout: {
							const copy = {
								...items,
							};
							delete copy[fromId];
							copy[parent.id] = {
								...parent,
								item_ids: parent.item_ids.filter(id => id !== fromId),
							};
							return copy;
						}
					}
					return items;
				}
				case 1: {
					const parent = items[from.parent_id];
					switch (parent.type) {
						case LayoutModelItemType.Layout: {
							const copy = {
								...items,
							};
							delete copy[fromId];
							copy[parent.id] = {
								...parent,
								item_ids: parent.item_ids.map(id => {
									return id === fromId ? from.item_ids[0] : id;
								}),
							};
							copy[from.item_ids[0]] = {
								...copy[from.item_ids[0]],
								parent_id: from.parent_id,
							};
							return flattenLayoutItems(copy, from.item_ids[0]);
						}
					}
					return items;
				}
				default: {
					const result = from.item_ids.reduce(flattenLayoutItems, items);
					const newFrom = result[fromId];
					switch (newFrom.type) {
						case LayoutModelItemType.Layout: {
							if (newFrom.item_ids.length !== amount) {
								return flattenLayoutItems(result, fromId);
							} else {
								return result;
							}
						}
					}
					return result;
				}
			}
		}
	}

	return items;
}

export function normalizeLayout<P extends TMinimumLayoutModelItemProps>(
	data: TDenormalizedLayout<P>,
): TLayoutStructure<P> {
	const result = {
		root_id: data.id,
		items: {},
	};

	const traverse = (item: TDenormalizedLayout<P>, parent_id?: string) => {
		if (item.items) {
			//nested layout
			const { items, ...rest } = item;
			result.items[item.id] = {
				...rest,
				parent_id,
				item_ids: item.items.map(nestedItem => nestedItem.id),
			};
			item.items.forEach(nestedItem => traverse(nestedItem, item.id));
		} else {
			//plain item
			result.items[item.id] = {
				...item,
				parent_id,
			};
		}
	};

	traverse(data);

	return setDefaults(result);
}

export function denormalizeLayout<P extends TMinimumLayoutModelItemProps>(
	layout: TLayoutStructure<P>,
): TDenormalizedLayout<P> {
	const construct = (id: string): TDenormalizedLayout<P> => {
		const item = layout.items[id];
		switch (item.type) {
			case LayoutModelItemType.Layout: {
				const { item_ids, parent_id, ...rest } = item;
				return {
					...rest,
					items: item_ids.map(construct),
				};
			}
			case LayoutModelItemType.Plain: {
				//noinspection UnnecessaryLocalVariableJS
				const { parent_id, ...rest } = item;
				return rest;
			}
		}
	};
	return construct(layout.root_id);
}

export function getDefaultChildrenSizes(
	layout: TLayoutStructure<TMinimumLayoutModelItemProps>,
	item: TLayoutModelLayout,
	containerSize: number,
	precision: number,
): number[] {
	const amount = item.item_ids.length;

	if (amount === 0) {
		return [];
	}

	if (amount === 1) {
		return [Number(containerSize.toFixed(precision))];
	}

	const items = item.item_ids.map(id => layout.items[id]);
	const sizes = items.map(item => item.size);

	//collect all defined sizes
	const defined = sizes.reduce((acc, size, i) => {
		if (typeof size !== 'undefined') {
			acc[i] = size;
		}
		return acc;
	}, {});

	//get amount of undefined sizes that should stretch
	const undefinedAmount = amount - Object.keys(defined).length;

	//get average stretching size
	const averageUndefinedSize = containerSize / undefinedAmount;

	//fill undefined sizes with average values
	const filled = sizes.reduce<Array<number>>((acc, size, i) => {
		if (typeof defined[i] !== 'undefined') {
			acc.push(defined[i]);
		} else {
			acc.push(Number(averageUndefinedSize.toFixed(precision)));
		}
		return acc;
	}, []);

	return fixFloatSizes(filled, containerSize, precision);
}

export function setDefaults<P extends TMinimumLayoutModelItemProps>(layout: TLayoutStructure<P>): TLayoutStructure<P> {
	const items = {
		...layout.items,
	};

	if (items[layout.root_id].size !== 1) {
		//root size is always 1
		items[layout.root_id] = {
			...items[layout.root_id],
			size: 1,
		};
	}

	const precision = 5;
	const size = 1;

	Object.keys(items).forEach(id => {
		let item = items[id];

		//set default type
		if (typeof item.type === 'undefined') {
			if (typeof item['item_ids'] !== 'undefined') {
				items[item.id] = {
					...items[item.id],
					type: LayoutModelItemType.Layout,
				} as TLayoutModelLayout;
			} else {
				items[item.id] = {
					...items[item.id],
					type: LayoutModelItemType.Plain,
				} as TLayoutModelItem<P>;
			}
		}

		//todo: find a way to mutate readonly object
		item = items[id];
		switch (item.type) {
			case LayoutModelItemType.Layout: {
				//nested layout

				//set default orientation
				if (!LayoutOrientation[item.orientation]) {
					items[item.id] = {
						...item,
						orientation: LayoutOrientation.Horizontal,
					};
				}

				//set default sizes
				const sizes = getDefaultChildrenSizes(layout, item, size, precision);
				item.item_ids.forEach((nestedItemId, i) => {
					const nestedItem = layout.items[nestedItemId];
					if (nestedItem.size !== sizes[i]) {
						items[nestedItem.id] = {
							...items[nestedItem.id],
							size: sizes[i],
						};
					}
				});
			}
		}
	});

	return {
		...layout,
		items,
	};
}

export function prepareLayout<P extends TMinimumLayoutModelItemProps>(
	layout: TDenormalizedLayout<P>,
): TLayoutStructure<P> {
	const normalized = normalizeLayout(layout);
	const items = flattenLayoutItems(normalized.items, normalized.root_id);
	return setDefaults({
		...normalized,
		items,
	});
}

export function getResizeHandlerSide(sizes: Array<number>, index: number): ResizeHandlerSide | undefined {
	const amount = sizes.length;
	if (amount > 1) {
		//ignore zeros
		if (sizes[index] !== 0) {
			if (index === 0) {
				//first

				//lookup to the right
				const allRightAreZeros = sizes.slice(index + 1).every(item => item === 0);
				if (!allRightAreZeros) {
					return ResizeHandlerSide.After;
				}
			} else if (index === amount - 1) {
				//last

				//lookup to the left
				const allLeftAreZeros = sizes.slice(0, index).every(item => item === 0);
				if (!allLeftAreZeros) {
					return ResizeHandlerSide.Before;
				}
			} else {
				//in the middle
				const allLeftAreZeros = sizes.slice(0, index).every(item => item === 0);
				const allRightAreZeros = sizes.slice(index + 1).every(item => item === 0);

				if (allLeftAreZeros) {
					//only after or none
					if (allRightAreZeros) {
						//none
					} else {
						//after
						return ResizeHandlerSide.After;
					}
				} else {
					//before or both
					if (allRightAreZeros) {
						//before
						return ResizeHandlerSide.Before;
					} else {
						//both
						return ResizeHandlerSide.Both;
					}
				}
			}
		}
	}

	return undefined;
}

export function setTransferData(event: DragEvent, data: {}): void {
	const dataTransfer = event.dataTransfer;

	if (!dataTransfer) {
		return;
	}

	if (data) {
		let value;
		try {
			value = {
				...JSON.parse(dataTransfer.getData('text')),
				...data,
			};
		} catch (e) {
			value = data;
		}
		dataTransfer.setData('text', JSON.stringify(value));
	}
}

export function setDragData<P>(event: DragEvent, data: P): void {
	setTransferData(event, {
		[NATIVE_DRAG_DATA_KEY]: data,
	});
}

export function countChildren<P extends TMinimumLayoutModelItemProps>(
	layout: TLayoutStructure<P>,
	item: TLayoutItem<P>,
	orientation: LayoutOrientation,
): number {
	if (item.type === LayoutModelItemType.Layout) {
		const nestedLayouts = item.item_ids.reduce<Array<TLayoutModelLayout>>((acc, id) => {
			const item = layout.items[id];
			if (item.type === LayoutModelItemType.Layout) {
				acc.push(item);
			}
			return acc;
		}, []);

		const nestedResult = nestedLayouts.reduce((acc, nestedLayout) => {
			return acc + countChildren(layout, nestedLayout, orientation);
		}, 0);

		if (item.orientation === orientation) {
			return item.item_ids.length - nestedLayouts.length + nestedResult;
		} else {
			return nestedResult || 1; //if nestedResult is 0 there are no nested layouts - count self
		}
	}

	return 1;
}

export function chooseByOrientation<H, V>(horizontal: H, vertical: V, orientation: LayoutOrientation): H | V {
	switch (orientation) {
		case LayoutOrientation.Horizontal: {
			return horizontal;
		}
		case LayoutOrientation.Vertical: {
			return vertical;
		}
	}
}

/////////////////

export type TSize = {
	width: number;
	height: number;
};
export type TSizeMap = {
	[itemId: string]: TSize;
};

export function getSizeMap<P extends TMinimumLayoutModelItemProps>(
	layout: TLayoutStructure<P>,
	item: TLayoutItem<P>,
	defaultMinWidth: number,
	defaultMinHeight: number,
	width: number,
	height: number,
	resizeHandlerSize: number,
	precision: number,
	ignoreId: string = '',
	acc: TSizeMap = {},
): TSizeMap {
	const updateSizeMap = (item: TLayoutItem<P>, width: number, height: number): TSize => {
		const minWidth = getMinWidth(item, defaultMinWidth);
		const minHeight = getMinHeight(item, defaultMinHeight);
		if (item.type !== LayoutModelItemType.Layout || item.item_ids.length === 0) {
			//either item is plain or empty (then just take passed sizes)
			return (acc[item.id] = {
				width: width === 0 ? 0 : Math.max(width, minWidth),
				height: height === 0 ? 0 : Math.max(height, minHeight),
			});
		} else {
			const sizes = item.item_ids.map(id => {
				const item = layout.items[id];
				return item.id === ignoreId ? 0 : item.size;
			});
			const resizeHandlersDelta = (sizes.length - 1 - (ignoreId ? 1 : 0)) * resizeHandlerSize;
			switch (item.orientation) {
				case LayoutOrientation.Vertical: {
					let finalWidth = Math.max(width, minWidth);
					let finalHeight = 0;

					const normalized = normalizeSizes(sizes, height - resizeHandlersDelta, precision);

					const childSizes = normalized.map((size, i) => {
						const child = layout.items[item.item_ids[i]];
						//pass normalized height
						const childSize = updateSizeMap(child, width, size);
						//collect max width
						finalWidth = Math.max(finalWidth, childSize.width);
						//increase total height
						finalHeight += childSize.height;

						return childSize;
					});

					//add resize handlers
					finalHeight += resizeHandlersDelta;

					//check if finalHeight is greater then passed height
					//and try to decrease siblings if there are some that can be shrinked
					if (finalHeight > height) {
						const diff = finalHeight - height;
						const amountOfMinimums = childSizes.filter(size => size.height === minHeight).length;
						const amountOfShrinkable = childSizes.length - amountOfMinimums;
						if (amountOfShrinkable > 0) {
							//still have some items to shrink
							const shrinkDelta = Number((diff / amountOfShrinkable).toFixed(precision));
							//iterate over calculated childSizes to shrink them and adjust finalHeight
							childSizes.forEach((childSize, i) => {
								if (childSize.height !== minHeight) {
									//shrink only items that can be shrinked
									const child = layout.items[item.item_ids[i]];
									const newSize = updateSizeMap(
										child,
										childSize.width,
										childSize.height - shrinkDelta,
									);
									finalHeight -= childSize.height;
									finalHeight += newSize.height;
									finalHeight = Number(finalHeight.toFixed(precision));
								}
							});
						}
						//nothing we can do here - take finalHeight which if greater than passed height
					}

					//store new sizes
					acc[item.id] = {
						width: finalWidth,
						height: finalHeight,
					};

					//check if siblings should be resized
					if (finalWidth > width) {
						//increase width of all siblings
						normalized.forEach((size, i) => {
							const child = layout.items[item.item_ids[i]];
							//finalWidth is maxWidth
							//do not update self
							if (acc[child.id].width !== finalWidth) {
								acc[child.id] = updateSizeMap(child, finalWidth, acc[child.id].height);
							}
						});
					}

					return acc[item.id];
				}

				case LayoutOrientation.Horizontal: //fallthrough
				default: {
					let finalHeight = Math.max(height, minHeight);
					let finalWidth = 0;

					const normalized = normalizeSizes(sizes, width - resizeHandlersDelta, precision);

					const childSizes = normalized.map((size, i) => {
						const child = layout.items[item.item_ids[i]];
						//pass normalized width
						const childSize = updateSizeMap(child, size, height);
						//collect max height
						finalHeight = Math.max(finalHeight, childSize.height);
						//increase total width
						finalWidth += childSize.width;

						return childSize;
					});

					//add resize handlers
					finalWidth += resizeHandlersDelta;

					//check if finalHeight is greater then passed height
					//and try to decrease siblings if there are some that can be shrinked
					if (finalWidth > width) {
						const diff = finalWidth - width;
						const amountOfMinimums = childSizes.filter(size => size.width === minWidth).length;
						const amountOfShrinkable = childSizes.length - amountOfMinimums;
						if (amountOfShrinkable > 0) {
							//still have some items to shrink
							const shrinkDelta = Number((diff / amountOfShrinkable).toFixed(precision));
							//iterate over calculated childSizes to shrink them and adjust finalHeight
							childSizes.forEach((childSize, i) => {
								if (childSize.width !== minWidth) {
									//shrink only items that can be shrinked
									const child = layout.items[item.item_ids[i]];
									const newSize = updateSizeMap(
										child,
										childSize.width - shrinkDelta,
										childSize.height,
									);
									finalWidth -= childSize.width; //
									finalWidth += newSize.width;
									finalWidth = Number(finalWidth.toFixed(precision));
								}
							});
						}
						//nothing we can do here - take finalHeight which if greater than passed height
					}

					//store new sizes
					acc[item.id] = {
						width: finalWidth,
						height: finalHeight,
					};

					//check if siblings should be resized
					if (finalHeight > height) {
						//increase height of all siblings
						normalized.forEach((size, i) => {
							const child = layout.items[item.item_ids[i]];
							//finalHeight is maxHeight
							//do not update self
							if (acc[child.id].height !== finalHeight) {
								acc[child.id] = updateSizeMap(child, acc[child.id].width, finalHeight);
							}
						});
					}

					return acc[item.id];
				}
			}
		}
	};
	updateSizeMap(item, width, height);
	return acc;
}

export function normalizeSizes(sizes: number[], containerSize: number, precision: number) {
	const amount = sizes.length;
	if (amount === 0) {
		return [];
	}
	if (amount === 1) {
		return [Number(containerSize.toFixed(precision))];
	}
	const k = getSum(sizes) / containerSize;
	const normalized = sizes.map(size => size / k);
	return fixFloatSizes(normalized, containerSize, precision);
}

export function isEmptyRoot(layout: TLayoutStructure<TMinimumLayoutModelItemProps>, item: TLayoutModelLayout): boolean {
	return item.id === layout.root_id && item.item_ids.length === 0;
}

export function getMinWidth(item: TLayoutItem<TMinimumLayoutModelItemProps>, defaultMinWidth: number): number {
	return item.type === LayoutModelItemType.Plain && item.props !== undefined && item.props.minWidth !== undefined
		? item.props.minWidth
		: defaultMinWidth;
}

export function getMinHeight(item: TLayoutItem<TMinimumLayoutModelItemProps>, defaultMinHeight: number): number {
	return item.type === LayoutModelItemType.Plain && item.props !== undefined && item.props.minHeight !== undefined
		? item.props.minHeight
		: defaultMinHeight;
}
