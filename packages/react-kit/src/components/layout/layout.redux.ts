import {
	LayoutModelItemType,
	TLayoutModelItem,
	ItemSide,
	TLayoutStructure,
	LayoutOrientation,
	TMinimumLayoutModelItemProps,
} from './layout.constants';
import {
	generateWrapperLayout,
	invalidateParents,
	prepareLayout,
	getSizeMap,
	chooseByOrientation,
	TSize,
	isEmptyRoot,
} from './layout.utils';
import { uuid } from '@devexperts/utils/dist/string/string';

enum ActionType {
	ItemRemove,
	ItemInsertAt,
	ItemInsertNativeAt,
	ItemInsertNativeAtEmptyRoot,
	ItemMoveTo,
	ItemResize,
}

type TItemRemoveAction = {
	type: ActionType.ItemRemove;
	payload: {
		id: string;
	};
};

type TItemInsertAtAction<P extends TMinimumLayoutModelItemProps> = {
	type: ActionType.ItemInsertAt;
	payload: {
		id: string;
		side: ItemSide;
		item: TLayoutModelItem<P>;
	};
};

type TItemInsertNativeAtAction<P extends TMinimumLayoutModelItemProps> = {
	type: ActionType.ItemInsertNativeAt;
	payload: {
		id: string;
		side: ItemSide;
		props: P;
	};
};

type TItemInsertNativeAtEmptyRootAction<P extends TMinimumLayoutModelItemProps> = {
	type: ActionType.ItemInsertNativeAtEmptyRoot;
	payload: {
		props: P;
	};
};

type TItemMoveToAction = {
	type: ActionType.ItemMoveTo;
	payload: {
		id: string;
		side: ItemSide;
		destinationId: string;
	};
};

type TItemResizeAction = {
	type: ActionType.ItemResize;
	payload: {
		id1: string;
		size1: number;
		id2: string;
		size2: number;
	};
};
export type TLayoutAction<P extends TMinimumLayoutModelItemProps> =
	| TItemRemoveAction
	| TItemInsertAtAction<P>
	| TItemMoveToAction
	| TItemResizeAction
	| TItemInsertNativeAtAction<P>
	| TItemInsertNativeAtEmptyRootAction<P>;

export const remove = (id: string): TItemRemoveAction => ({
	type: ActionType.ItemRemove,
	payload: {
		id,
	},
});

export const insertAt = <P extends TMinimumLayoutModelItemProps>(
	item: TLayoutModelItem<P>,
	id: string,
	side: ItemSide,
): TItemInsertAtAction<P> => ({
	type: ActionType.ItemInsertAt,
	payload: {
		item,
		id,
		side,
	},
});

export const insertNativeAt = <P extends TMinimumLayoutModelItemProps>(
	props: P,
	id: string,
	side: ItemSide,
): TItemInsertNativeAtAction<P> => ({
	type: ActionType.ItemInsertNativeAt,
	payload: {
		props,
		id,
		side,
	},
});

export const insertNativeAtEmptyRoot = <P extends TMinimumLayoutModelItemProps>(
	props: P,
): TItemInsertNativeAtEmptyRootAction<P> => ({
	type: ActionType.ItemInsertNativeAtEmptyRoot,
	payload: {
		props,
	},
});

export const moveTo = (id: string, destinationId: string, side: ItemSide): TItemMoveToAction => ({
	type: ActionType.ItemMoveTo,
	payload: {
		id,
		destinationId,
		side,
	},
});

export const resize = (id1: string, size1: number, id2: string, size2: number): TItemResizeAction => ({
	type: ActionType.ItemResize,
	payload: {
		id1,
		size1,
		id2,
		size2,
	},
});

const createInitial = (): TLayoutStructure<never> => {
	const root_id = uuid();
	return prepareLayout({
		id: root_id,
		size: 1,
		items: [],
		orientation: LayoutOrientation.Horizontal,
	});
};

export const reducer = <P extends TMinimumLayoutModelItemProps>(
	state: TLayoutStructure<P> = createInitial(),
	action: TLayoutAction<P>,
): TLayoutStructure<P> => {
	switch (action.type) {
		case ActionType.ItemInsertNativeAtEmptyRoot: {
			const { props } = action.payload;
			const root = state.items[state.root_id];
			if (root.type === LayoutModelItemType.Layout && isEmptyRoot(state, root)) {
				const id = uuid();
				return {
					...state,
					items: {
						...state.items,
						[root.id]: {
							...root,
							item_ids: [id],
						},
						[id]: {
							type: LayoutModelItemType.Plain,
							id,
							size: 1,
							parent_id: root.id,
							props,
						},
					},
				};
			}
			return state;
		}

		case ActionType.ItemInsertNativeAt: {
			const { props, id, side } = action.payload;
			const item: TLayoutModelItem<P> = {
				type: LayoutModelItemType.Plain,
				size: 0,
				parent_id: '',
				id: uuid(),
				props,
			};
			return reducer(state, insertAt(item, id, side));
		}

		case ActionType.ItemInsertAt: {
			const { item, id, side } = action.payload;
			const destination = state.items[id];
			if (!destination) {
				return state;
			}
			const parent = state.items[destination.parent_id];
			if (!parent) {
				return state;
			}

			if (destination.type === LayoutModelItemType.Layout) {
				const { orientation } = destination;

				if (
					(orientation === LayoutOrientation.Vertical && side === ItemSide.Top) ||
					(orientation === LayoutOrientation.Vertical && side === ItemSide.Bottom) ||
					(orientation === LayoutOrientation.Horizontal && side === ItemSide.Left) ||
					(orientation === LayoutOrientation.Horizontal && side === ItemSide.Right)
				) {
					const item_ids =
						side === ItemSide.Top || side === ItemSide.Left
							? [item.id, ...destination.item_ids]
							: [...destination.item_ids, item.id];

					const items = {
						...state.items,
						[item.id]: {
							...item,
							size: 0.5,
							parent_id: destination.id,
						},
						[destination.id]: {
							...destination,
							item_ids,
						},
					};
					return {
						...state,
						items: invalidateParents(items, destination.id),
					};
				}

				if (parent.type === LayoutModelItemType.Layout) {
					const wrapper = generateWrapperLayout(item.id, destination, parent, side);

					const items = {
						...state.items,
						[destination.id]: {
							...destination,
							size: 0.5,
							parent_id: wrapper.id,
						},
						[parent.id]: {
							...parent,
							item_ids: parent.item_ids.map(itemId => {
								return itemId === destination.id ? wrapper.id : itemId;
							}),
						},
						[wrapper.id]: wrapper,
						[item.id]: {
							...item,
							size: 0.5,
							parent_id: wrapper.id,
						},
					};
					return {
						...state,
						items: invalidateParents(items, destination.id),
					};
				}
			}

			if (destination.type === LayoutModelItemType.Plain) {
				const parent = state.items[destination.parent_id];
				if (parent.type === LayoutModelItemType.Layout) {
					const orientation = parent.orientation;
					const destinationIndex = parent.item_ids.indexOf(id);

					//check if item can be inserted into existing LayoutModel before destination
					if (
						(orientation === LayoutOrientation.Horizontal && side === ItemSide.Left) ||
						(orientation === LayoutOrientation.Vertical && side === ItemSide.Top)
					) {
						const size = destination.size / 2;
						const items = {
							...state.items,
							[parent.id]: {
								...parent,
								item_ids: [
									...parent.item_ids.slice(0, destinationIndex),
									item.id,
									...parent.item_ids.slice(destinationIndex),
								],
							},
							[item.id]: {
								...item,
								size,
								parent_id: parent.id,
							},
							[destination.id]: {
								...destination,
								size,
							},
						};
						return {
							...state,
							items: invalidateParents(items, destination.id),
						};
					}

					//check if item can be inserted into existing LayoutModel after destination
					if (
						(orientation === LayoutOrientation.Horizontal && side === ItemSide.Right) ||
						(orientation === LayoutOrientation.Vertical && side === ItemSide.Bottom)
					) {
						const size = destination.size / 2;
						const items = {
							...state.items,
							[parent.id]: {
								...parent,
								item_ids: [
									...parent.item_ids.slice(0, destinationIndex + 1),
									item.id,
									...parent.item_ids.slice(destinationIndex + 1),
								],
							},
							[item.id]: {
								...item,
								size,
								parent_id: parent.id,
							},
							[destination.id]: {
								...destination,
								size,
							},
						};
						return {
							...state,
							items: invalidateParents(items, destination.id),
						};
					}

					//wrap destination with nested layout
					const wrapper = generateWrapperLayout(item.id, destination, parent, side);

					const items = {
						...state.items,
						[destination.id]: {
							...destination,
							size: 0.5,
							parent_id: wrapper.id,
						},
						[parent.id]: {
							...parent,
							item_ids: parent.item_ids.map(itemId => {
								return itemId === destination.id ? wrapper.id : itemId;
							}),
						},
						[wrapper.id]: wrapper,
						[item.id]: {
							...item,
							size: 0.5,
							parent_id: wrapper.id,
						},
					};
					return {
						...state,
						items: invalidateParents(items, parent.id),
					};
				}
			}

			return state;
		}

		case ActionType.ItemMoveTo: {
			const { id, destinationId, side } = action.payload;
			const item = state.items[id];
			if (item.type === LayoutModelItemType.Plain) {
				return reducer(reducer(state, remove(id)), insertAt(item, destinationId, side));
			}
			return state;
		}

		case ActionType.ItemResize: {
			const { id1, size1, id2, size2 } = action.payload;
			const items = {
				...state.items,
				[id1]: {
					...state.items[id1],
					size: size1,
				},
				[id2]: {
					...state.items[id2],
					size: size2,
				},
			};
			return {
				...state,
				//it's assumed that both id1 and id2 are in one layout - so invalidate only from one of them
				//also size change does not affect current parent, so invalidation should start from current item
				items: invalidateParents(items, id1),
			};
		}

		case ActionType.ItemRemove: {
			//todo refactor
			const { id } = action.payload;
			const item = state.items[id];
			if (item.type === LayoutModelItemType.Plain) {
				let parent = state.items[item.parent_id];
				if (parent.type === LayoutModelItemType.Layout) {
					const newIds = parent.item_ids.filter(itemId => itemId !== id);
					//update parent with new ids
					parent = {
						...parent,
						item_ids: newIds,
					};
					const items = {
						...state.items,
						[parent.id]: parent,
					};
					//remove item
					delete items[id];

					//check if last item in parent layout
					if (newIds.length === 1) {
						//last item - replace parent layout with that item
						const grandParent = items[parent.parent_id];
						if (grandParent) {
							//not root
							if (grandParent.type === LayoutModelItemType.Layout) {
								items[grandParent.id] = {
									...grandParent,
									item_ids: grandParent.item_ids.map(itemId => {
										return itemId === parent.id ? newIds[0] : itemId;
									}),
								};

								//update parent_id to grandParent.id
								items[newIds[0]] = {
									...items[newIds[0]],
									size: parent.size,
									parent_id: grandParent.id,
								};

								delete items[parent.id];

								return {
									...state,
									items: invalidateParents(items, grandParent.id),
								};
							}
							return state;
						}
					}

					const sizeMap = getSizeMap(state, parent, 0, 0, 1, 1, 0, 5);
					const accessor = chooseByOrientation(
						(size: TSize) => size.width,
						(size: TSize) => size.height,
						parent.orientation,
					);
					newIds.forEach((newId, i) => {
						const newItem = state.items[newId];
						const value = accessor(sizeMap[newId]);
						if (newItem.size !== value) {
							items[newItem.id] = {
								...newItem,
								size: value,
							};
						}
					});

					return {
						...state,
						items: invalidateParents(items, parent.id),
					};
				}
			}

			return state;
		}

		default: {
			return state || createInitial();
		}
	}
};
