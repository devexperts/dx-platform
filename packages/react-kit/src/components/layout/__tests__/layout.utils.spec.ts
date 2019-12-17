import { insertAt, insertNativeAt, insertNativeAtEmptyRoot, moveTo, reducer, remove, resize } from '../layout.redux';

import {
	chooseByOrientation,
	countChildren,
	denormalizeLayout,
	fixFloatSizes,
	flattenLayoutItems,
	generateWrapperLayout,
	getDefaultChildrenSizes,
	getMinHeight,
	getMinWidth,
	getPlaceholderPlacement,
	getResizeHandlerSide,
	getSizeMap,
	normalizeLayout,
	normalizeSizes,
	prepareLayout,
	setDefaults,
	setDragData,
	setTransferData,
} from '../layout.utils';
import {
	ItemSide,
	LayoutModelItemType,
	LayoutOrientation,
	NATIVE_DRAG_DATA_KEY,
	ResizeHandlerSide,
	TLayoutItem,
	TLayoutModelLayout,
	TLayoutStructure,
	TMinimumLayoutModelItemProps,
} from '../layout.constants';
import { uuid } from '@devexperts/utils/dist/string/string';
import { assert, integer, property } from 'fast-check';

const minProps = { minWidth: 260, minHeight: 130 };

describe('LayoutModel', () => {
	describe('reducer', () => {
		it('should set initial', () => {
			const initial = reducer(null as any, {} as any);
			expect(initial.root_id).toEqual(jasmine.any(String));
			expect(initial.items[initial.root_id]).toEqual({
				id: jasmine.any(String),
				size: 1,
				item_ids: [],
				type: LayoutModelItemType.Layout,
				orientation: LayoutOrientation.Horizontal,
			});
		});

		describe('remove item', () => {
			const data: any = {
				id: 'root',
				items: [
					{
						id: '1',
					},
					{
						id: '2',
					},
					{
						id: 'nested',
						items: [
							{
								id: '3',
							},
							{
								id: '4',
							},
							{
								id: '5',
							},
						],
					},
				],
			};
			it('should ignore removing nested layouts', () => {
				const layout = prepareLayout(data);
				const result = reducer(layout, remove(data.items[2].id));
				expect(result).toEqual(layout);
			});
			it('should remove item', () => {
				const result = reducer(prepareLayout(data), remove(data.items[0].id));
				const expected = prepareLayout({
					...data,
					items: data.items.slice(1),
				});
				Object.values(expected.items).forEach((item: object) => delete item['size']);
				Object.values(result.items).forEach((item: object) => delete item['size']);
				expect(result).toEqual(expected);
			});
			it('should replace layout with one item with that item', () => {
				const layout = prepareLayout(data);
				let result = reducer(layout, remove(data.items[2].items[0].id));
				result = reducer(result, remove(data.items[2].items[1].id));
				const expected = prepareLayout({
					...data,
					items: [
						data.items[0],
						data.items[1],
						{
							...data.items[2].items[2],
						},
					],
				});
				Object.values(expected.items).forEach((value: object) => delete value['size']);
				Object.values(result.items).forEach((value: object) => delete value['size']);
				expect(result).toEqual(expected);
			});
			it('should preserve references to unchanged items', () => {
				const normalized = normalizeLayout(data);
				const result = reducer(normalized, remove(data.items[2].items[0].id));
				expect(result).not.toBe(normalized);
				expect(result.items).not.toBe(normalized.items);
				expect(result.items[data.items[0].id]).toBe(normalized.items[data.items[0].id]);
				expect(result.items[data.items[1].id]).toBe(normalized.items[data.items[1].id]);
				expect(result.items[data.items[2].id]).not.toBe(normalized.items[data.items[2].id]);
				expect(result.items[data.items[2].items[1].id]).not.toBe(normalized.items[data.items[2].items[1].id]);
				expect(result.items[data.items[2].items[2].id]).not.toBe(normalized.items[data.items[2].items[2].id]);
			});
			it('should propagate changes deeply up to the root', () => {
				const idRoot = 'root';
				const id1 = '1';
				const id2 = '2';
				const id3 = '3';
				const id4 = '4';
				const idToRemove = '5';
				const idNested1 = 'nested1';
				const idNested2 = 'nested2';
				const deep = {
					id: idRoot,
					items: [
						{
							id: id1,
						},
						{
							id: idNested1,
							items: [
								{
									id: id2,
								},
								{
									id: idNested2,
									items: [
										//make sure to have at leats 3 items here for this test
										//otherwise this layout will be replaced by item
										{
											id: id3,
										},
										{
											id: id4,
										},
										{
											id: idToRemove,
										},
									],
								},
							],
						},
					],
				};
				const normalized = normalizeLayout(deep);
				const result = reducer(normalized, remove(idToRemove));
				expect(result).not.toBe(normalized);
				expect(result.items).not.toBe(normalized.items);

				//same level
				expect(result.items[id3]).toEqual({
					...normalized.items[id3],
					size: jasmine.any(Number),
				});
				expect(result.items[id4]).toEqual({
					...normalized.items[id4],
					size: jasmine.any(Number),
				});
				expect(result.items[idNested2]).not.toBe(normalized.items[idNested2]);
				expect(result.items[id2]).toBe(normalized.items[id2]);

				//deeper (upper)
				expect(result.items[idNested1]).not.toBe(normalized.items[idNested1]);
				expect(result.items[id1]).toBe(normalized.items[id1]);
				expect(result.items[idRoot]).not.toBe(normalized.items[idRoot]);

				//also check case with layout replacement
				const result2 = reducer(result, remove(id4));
				expect(result2.items[id2]).toBe(normalized.items[id2]);
				expect(result2.items[idNested1]).not.toBe(normalized.items[idNested1]);
				expect(result2.items[id1]).toBe(normalized.items[id1]);
				expect(result2.items[idRoot]).not.toBe(normalized.items[idRoot]);
			});

			it('should update siblings sizes', () => {
				const data = {
					id: 'root',
					orientation: LayoutOrientation.Horizontal,
					size: 1,
					items: [
						{
							id: '1',
							size: 0.25,
						},
						{
							id: '2',
							size: 0.25,
						},
						{
							id: '3',
							size: 0.5,
						},
					],
				};
				const layout = prepareLayout(data);
				const result = reducer(layout, remove('3'));
				const expected = prepareLayout({
					...data,
					items: [
						{
							...data.items[0],
							size: 0.5,
						},
						{
							...data.items[1],
							size: 0.5,
						},
					],
				});
				expect(result).toEqual(expected);
			});

			it('should take granparent size and set on the last item in removing layout', () => {
				const data: any = {
					id: 'root',
					orientation: LayoutOrientation.Horizontal,
					items: [
						{
							id: '1',
							size: 25,
						},
						{
							id: 'nested',
							size: 75,
							orientation: LayoutOrientation.Horizontal,
							items: [
								{
									id: '2',
									size: 50,
								},
								{
									id: '3',
									size: 50,
								},
							],
						},
					],
				};
				const layout = prepareLayout(data);
				const result = reducer(layout, remove('3'));
				const expected = prepareLayout({
					...data,
					items: [
						{
							...data.items[0],
							size: 25,
						},
						{
							...data.items[1].items[0],
							size: 75,
						},
					],
				});
				expect(result).toEqual(expected);
			});
		});

		describe('insert item', () => {
			it('should ignore inserting into layouts', () => {
				const data = {
					id: 'root',
					items: [],
				};
				const normalized = normalizeLayout(data);
				expect(
					reducer(
						normalized,
						insertAt(
							{ id: '123', parent_id: 'root', size: 1, type: LayoutModelItemType.Plain, props: minProps },
							data.id,
							ItemSide.Bottom,
						),
					),
				).toBe(normalized);
			});

			describe('into item in horizontal layout', () => {
				const idRoot = 'root';
				const id1 = '1';
				const id2 = '2';
				const data = {
					id: idRoot,
					orientation: LayoutOrientation.Horizontal,
					type: LayoutModelItemType.Layout,
					items: [
						{
							type: LayoutModelItemType.Plain,
							id: id1,
						},
						{
							type: LayoutModelItemType.Plain,
							id: id2,
						},
					],
				};
				const item = {
					type: LayoutModelItemType.Plain,
					id: 'inserted',
				};

				it('should insert to the left side', () => {
					const layout = prepareLayout(data);
					const result = reducer(layout, insertAt(item as any, data.items[1].id, ItemSide.Left));
					const expected = prepareLayout({
						...data,
						items: [...data.items.slice(0, 1), item, ...data.items.slice(1)],
					} as any);
					Object.values(expected.items).forEach((value: object) => {
						delete value['size'];
					});
					Object.values(result.items).forEach((value: object) => {
						delete value['size'];
					});
					expect(result).toEqual(expected);
				});

				it('should insert to the right side', () => {
					const layout = prepareLayout(data);
					const result = reducer(layout, insertAt(item as any, data.items[0].id, ItemSide.Right));
					const expected = prepareLayout({
						...data,
						items: [...data.items.slice(0, 1), item, ...data.items.slice(1)],
					} as any);
					Object.values(expected.items).forEach((value: object) => {
						delete value['type'];
						delete value['size'];
					});
					Object.values(result.items).forEach((value: object) => {
						delete value['type'];
						delete value['size'];
					});
					expect(result).toEqual(expected);
				});

				it('should wrap when inserting to the top', () => {
					const layout = prepareLayout(data);
					const result = reducer(layout, insertAt(item as any, data.items[0].id, ItemSide.Top));
					const expected = {
						...layout,
						items: {
							...layout.items,
							[idRoot]: {
								...layout.items[idRoot],
								item_ids: [jasmine.any(String), id2],
							},
							[id1]: {
								...layout.items[id1],
								size: jasmine.any(Number),
								parent_id: jasmine.any(String),
							},
							[item.id]: {
								...item,
								size: jasmine.any(Number),
								parent_id: jasmine.any(String),
							},
						},
					};
					const addedId = Object.keys(result.items).filter(
						id => ![id1, item.id, id2, idRoot].includes(id),
					)[0];
					const added = result.items[addedId];
					delete result.items[addedId];
					expect(result).toEqual(expected);
					expect(added).toEqual({
						id: jasmine.any(String),
						parent_id: idRoot,
						orientation: LayoutOrientation.Vertical,
						size: jasmine.any(Number),
						type: jasmine.any(Number),
						item_ids: [item.id, id1],
					});
				});

				it('should wrap when inserting to the bottom', () => {
					const layout = prepareLayout(data);
					const result = reducer(layout, insertAt(item as any, data.items[0].id, ItemSide.Bottom));
					const expected = {
						...layout,
						items: {
							...layout.items,
							[idRoot]: {
								...layout.items[idRoot],
								item_ids: [jasmine.any(String), id2],
							},
							[id1]: {
								...layout.items[id1],
								size: jasmine.any(Number),
								parent_id: jasmine.any(String),
							},
							[item.id]: {
								...item,
								size: jasmine.any(Number),
								parent_id: jasmine.any(String),
							},
						},
					};
					const addedId = Object.keys(result.items).filter(
						id => ![id1, id2, item.id, idRoot].includes(id),
					)[0];
					const added = result.items[addedId];
					delete result.items[addedId];
					expect(result).toEqual(expected);
					expect(added).toEqual({
						id: jasmine.any(String),
						parent_id: idRoot,
						orientation: LayoutOrientation.Vertical,
						size: jasmine.any(Number),
						type: jasmine.any(Number),
						item_ids: [id1, item.id],
					});
				});

				it('should take destination size and set 50% size to items when wrapping with layout', () => {
					const data = {
						id: 'root',
						items: [
							{
								id: '1',
							},
							{
								id: '2',
							},
						],
					};
					const layout = prepareLayout(data);
					const item = {
						type: LayoutModelItemType.Plain,
						id: 'inserted',
					};
					const item2 = {
						type: LayoutModelItemType.Plain,
						id: 'inserted2',
					};
					let result = reducer(layout, insertAt(item as any, data.items[0].id, ItemSide.Top));
					result = reducer(result, insertAt(item2 as any, data.items[1].id, ItemSide.Bottom));
					result = denormalizeLayout(result) as any;

					const expected = {
						id: 'root',
						orientation: LayoutOrientation.Horizontal,
						size: 1,
						type: jasmine.any(Number),
						items: [
							{
								id: jasmine.any(String),
								orientation: LayoutOrientation.Vertical,
								type: jasmine.any(Number),
								size: 0.5,
								items: [
									{
										...item,
										type: jasmine.any(Number),
										size: 0.5,
									},
									{
										...data.items[0],
										type: jasmine.any(Number),
										size: 0.5,
									},
								],
							},
							{
								id: jasmine.any(String),
								orientation: LayoutOrientation.Vertical,
								type: jasmine.any(Number),
								size: 0.5,
								items: [
									{
										...data.items[1],
										type: jasmine.any(Number),
										size: 0.5,
									},
									{
										...item2,
										type: jasmine.any(Number),
										size: 0.5,
									},
								],
							},
						],
					};
					expect(result).toEqual(expected);
				});

				it('should update siblings sizes when inserting horizontally', () => {
					const data = {
						id: 'root',
						items: [
							{
								id: '1',
							},
							{
								id: '2',
							},
						],
					};
					const layout = prepareLayout(data);
					const item = {
						id: 'inserted',
					};
					const item2 = {
						id: 'inserted2',
					};
					let result = reducer(layout, insertAt(item as any, data.items[1].id, ItemSide.Left));
					result = reducer(result, insertAt(item2 as any, data.items[0].id, ItemSide.Right));
					const expected = prepareLayout({
						...data,
						items: [
							{
								...data.items[0],
								size: 0.25,
							},
							{
								...item2,
								size: 0.25,
							},
							{
								...item,
								size: 0.25,
							},
							{
								...data.items[1],
								size: 0.25,
							},
						],
					});
					Object.values(result.items).forEach((item: object) => delete item['type']);
					Object.values(expected.items).forEach((item: object) => delete item['type']);
					expect(result).toEqual(expected);
				});
			});

			describe('into item in vertical layout', () => {
				const idRoot = 'root';
				const id1 = '1';
				const id2 = '2';
				const data = {
					id: idRoot,
					orientation: LayoutOrientation.Vertical,
					type: LayoutModelItemType.Layout,
					items: [
						{
							type: LayoutModelItemType.Plain,
							id: id1,
						},
						{
							type: LayoutModelItemType.Plain,
							id: id2,
						},
					],
				};
				const item = {
					id: 'inserted',
					type: LayoutModelItemType.Plain,
				};

				it('should insert to the top side', () => {
					const layout = prepareLayout(data);
					const result = reducer(layout, insertAt(item as any, data.items[1].id, ItemSide.Top));
					const expected = prepareLayout({
						...data,
						items: [...data.items.slice(0, 1), item, ...data.items.slice(1)],
					} as any);
					Object.values(expected.items).forEach((value: object) => delete value['size']);
					Object.values(result.items).forEach((value: object) => delete value['size']);
					expect(result).toEqual(expected);
				});

				it('should insert to the bottom side', () => {
					const layout = prepareLayout(data);
					const result = reducer(layout, insertAt(item as any, data.items[0].id, ItemSide.Bottom));
					const expected = prepareLayout({
						...data,
						items: [...data.items.slice(0, 1), item, ...data.items.slice(1)],
					} as any);
					Object.values(expected.items).forEach((value: object) => delete value['size']);
					Object.values(result.items).forEach((value: object) => delete value['size']);
					expect(result).toEqual(expected);
				});

				it('should wrap when inserting to the left', () => {
					const layout = prepareLayout(data);
					const result = reducer(layout, insertAt(item as any, data.items[0].id, ItemSide.Left));
					const expected = {
						...layout,
						items: {
							...layout.items,
							[idRoot]: {
								...layout.items[idRoot],
								item_ids: [jasmine.any(String), id2],
							},
							[id1]: {
								...layout.items[id1],
								size: jasmine.any(Number),
								parent_id: jasmine.any(String),
							},
							[item.id]: {
								...item,
								size: jasmine.any(Number),
								parent_id: jasmine.any(String),
							},
						},
					};
					const addedId = Object.keys(result.items).filter(
						id => ![id1, id2, item.id, idRoot].includes(id),
					)[0];
					const added: object = result.items[addedId];
					delete added['size'];
					delete result.items[addedId];
					expect(result).toEqual(expected);
					expect(added).toEqual({
						id: jasmine.any(String),
						parent_id: idRoot,
						type: jasmine.any(Number),
						orientation: LayoutOrientation.Horizontal,
						item_ids: [item.id, id1],
					});
				});

				it('should wrap when inserting to the right', () => {
					const layout = prepareLayout(data);
					const result = reducer(layout, insertAt(item as any, data.items[0].id, ItemSide.Right));
					const expected = {
						...layout,
						items: {
							...layout.items,
							[idRoot]: {
								...layout.items[idRoot],
								item_ids: [jasmine.any(String), id2],
							},
							[id1]: {
								...layout.items[id1],
								size: jasmine.any(Number),
								parent_id: jasmine.any(String),
							},
							[item.id]: {
								...item,
								size: jasmine.any(Number),
								parent_id: jasmine.any(String),
							},
						},
					};
					const addedId = Object.keys(result.items).filter(
						id => ![id1, id2, item.id, idRoot].includes(id),
					)[0];
					const added: object = result.items[addedId];
					delete added['size'];
					delete result.items[addedId];
					expect(result).toEqual(expected);
					expect(added).toEqual({
						id: jasmine.any(String),
						parent_id: idRoot,
						type: jasmine.any(Number),
						orientation: LayoutOrientation.Horizontal,
						item_ids: [id1, item.id],
					});
				});

				it('should take destination size and set 50% size to items when wrapping with layout', () => {
					const data = {
						id: 'root',
						orientation: LayoutOrientation.Vertical,
						items: [
							{
								id: '1',
							},
							{
								id: '2',
							},
						],
					};
					const layout = prepareLayout(data);
					const item = {
						id: 'inserted',
						type: LayoutModelItemType.Plain,
					};
					const item2 = {
						id: 'inserted2',
						type: LayoutModelItemType.Plain,
					};
					let result = reducer(layout, insertAt(item as any, data.items[0].id, ItemSide.Left));
					result = reducer(result, insertAt(item2 as any, data.items[1].id, ItemSide.Right));
					result = denormalizeLayout(result) as any;

					const expected = {
						id: 'root',
						orientation: LayoutOrientation.Vertical,
						type: LayoutModelItemType.Layout,
						size: 1,
						items: [
							{
								id: jasmine.any(String),
								orientation: LayoutOrientation.Horizontal,
								size: 0.5,
								type: LayoutModelItemType.Layout,
								items: [
									{
										...item,
										type: LayoutModelItemType.Plain,
										size: 0.5,
									},
									{
										...data.items[0],
										type: LayoutModelItemType.Plain,
										size: 0.5,
									},
								],
							},
							{
								id: jasmine.any(String),
								orientation: LayoutOrientation.Horizontal,
								type: LayoutModelItemType.Layout,
								size: 0.5,
								items: [
									{
										...data.items[1],
										type: LayoutModelItemType.Plain,
										size: 0.5,
									},
									{
										...item2,
										type: LayoutModelItemType.Plain,
										size: 0.5,
									},
								],
							},
						],
					};
					expect(result).toEqual(expected);
				});

				it('should update siblings sizes when inserting vertically', () => {
					const data = {
						id: 'root',
						orientation: LayoutOrientation.Vertical,
						items: [
							{
								id: '1',
							},
							{
								id: '2',
							},
						],
					};
					const layout = prepareLayout(data);
					const item = {
						id: 'inserted',
					};
					const item2 = {
						id: 'inserted2',
					};
					let result = reducer(layout, insertAt(item as any, data.items[1].id, ItemSide.Top));
					result = reducer(result, insertAt(item2 as any, data.items[0].id, ItemSide.Bottom));
					const expected = prepareLayout({
						...data,
						items: [
							{
								...data.items[0],
								size: 0.25,
							},
							{
								...item2,
								size: 0.25,
							},
							{
								...item,
								size: 0.25,
							},
							{
								...data.items[1],
								size: 0.25,
							},
						],
					});
					Object.values(result.items).forEach((value: object) => delete value['type']);
					Object.values(expected.items).forEach((value: object) => delete value['type']);
					expect(result).toEqual(expected);
				});
			});
		});

		describe('insert native at empty root', () => {
			it('should ignore non-empty root', () => {
				const layout = prepareLayout({
					id: 'root',
					items: [
						{
							id: '1',
						},
					],
				});
				const result = reducer(layout, insertNativeAtEmptyRoot(minProps));
				expect(result).toBe(layout);
			});
			it('should insert to empty root', () => {
				const data = {
					id: 'root',
					size: 1,
					type: LayoutModelItemType.Layout,
					orientation: LayoutOrientation.Horizontal,
					items: [],
				};
				const layout = prepareLayout(data);
				const props = minProps;
				const result = reducer(layout, insertNativeAtEmptyRoot(props));
				const expected = {
					...data,
					items: [
						{
							id: jasmine.any(String),
							size: 1,
							type: LayoutModelItemType.Plain,
							props,
						},
					],
				};
				expect(denormalizeLayout(result)).toEqual(expected);
			});
		});

		describe('insert native', () => {
			it('should accept inserting only props', () => {
				const props = minProps;
				const idRoot = 'root';
				const id1 = '1';
				const data = {
					id: idRoot,
					orientation: LayoutOrientation.Horizontal,
					type: LayoutModelItemType.Layout,
					size: 1,
					items: [
						{
							type: LayoutModelItemType.Plain,
							size: 1,
							id: id1,
						},
					],
				};
				const layout = prepareLayout(data);

				const result = reducer(layout, insertNativeAt(props, id1, ItemSide.Left));
				const expected = {
					...data,
					items: [
						{
							id: jasmine.any(String),
							props,
							type: LayoutModelItemType.Plain,
							size: 0.5,
						},
						{
							...data.items[0],
							size: 0.5,
						},
					],
				};
				expect(denormalizeLayout(result)).toEqual(expected);
			});
		});

		describe('move item to', () => {
			it('should correcly move', () => {
				const idRoot = 'root';
				const id1 = '1';
				const id2 = '2';
				const id3 = '3';
				const id4 = '4';
				const idNested = 'nested';
				const data = {
					id: idRoot,
					orientation: LayoutOrientation.Horizontal,
					items: [
						{
							id: id1,
						},
						{
							id: idNested,
							orientation: LayoutOrientation.Vertical,
							items: [
								{
									id: id2,
								},
								{
									id: id3,
								},
								{
									id: id4,
								},
							],
						},
					],
				};
				const normalized = normalizeLayout(data);
				const result = reducer(normalized, moveTo(id3, id1, ItemSide.Top));
				const expected = {
					...normalized,
					items: {
						...normalized.items,
						[idRoot]: {
							...normalized.items[idRoot],
							item_ids: [jasmine.any(String), idNested],
						},
						[idNested]: {
							...normalized.items[idNested],
							item_ids: [id2, id4],
						},
						[id2]: {
							...normalized.items[id2],
							size: jasmine.any(Number),
						},
						[id4]: {
							...normalized.items[id4],
							size: jasmine.any(Number),
						},
						[id1]: {
							...normalized.items[id1],
							parent_id: jasmine.any(String),
							size: jasmine.any(Number),
						},
						[id3]: {
							...normalized.items[id3],
							size: jasmine.any(Number),
							parent_id: jasmine.any(String),
						},
					},
				};
				const addedId = Object.keys(result.items).filter(
					id => ![id1, id2, id3, id4, idNested, idRoot].includes(id),
				)[0];
				const added = result.items[addedId];
				delete result.items[addedId];
				expect(result).toEqual(expected);
				expect(added).toEqual({
					id: jasmine.any(String),
					orientation: LayoutOrientation.Vertical,
					parent_id: idRoot,
					type: jasmine.any(Number),
					size: jasmine.any(Number),
					item_ids: [id3, id1],
				});
			});
		});

		describe('resize items', () => {
			it('should resize', () => {
				const data = {
					id: 'root',
					items: [
						{
							id: '1',
							size: 0.2,
						},
						{
							id: '2',
							size: 0.8,
						},
					],
				};
				const layout = prepareLayout(data);
				const action = resize(
					data.items[0].id,
					Number((data.items[0].size + 0.1).toFixed(5)),
					data.items[1].id,
					Number((data.items[1].size - 0.1).toFixed(5)),
				);
				const result = reducer(layout, action);
				const expected = prepareLayout({
					...data,
					items: [
						{
							...data.items[0],
							size: Number((data.items[0].size + 0.1).toFixed(5)),
						},
						{
							...data.items[1],
							size: Number((data.items[1].size - 0.1).toFixed(5)),
						},
					],
				});
				expect(result).toEqual(expected);
			});
			it('should propagate changes to root', () => {
				const data = {
					id: 'root',
					items: [
						{
							id: '1',
						},
						{
							id: 'nested',
							items: [
								{
									id: '2',
									size: 20,
								},
								{
									id: '3',
									size: 80,
								},
							],
						},
					],
				};
				const layout = prepareLayout(data);
				const action = resize('2', 30, '3', 70);
				const result = reducer(layout, action);
				expect(layout.items).not.toBe(result.items);
				expect(layout.items[layout.root_id]).not.toBe(result.items[result.root_id]);
				expect(layout.items['1']).toBe(result.items['1']);
				expect(layout.items['nested']).not.toBe(result.items['nested']);
			});
		});
	});

	describe('flattenLayoutItems', () => {
		it('should ignore empty root', () => {
			const data = normalizeLayout({
				id: 'root',
				items: [],
			});
			expect(flattenLayoutItems(data.items, data.root_id)).toBe(data.items);
		});
		it('should ignore root with one item', () => {
			const data = normalizeLayout({
				id: 'root',
				items: [
					{
						id: '1',
					},
				],
			});
			expect(flattenLayoutItems(data.items, data.root_id)).toBe(data.items);
		});
		it('should remove empty nested layouts', () => {
			const data = {
				id: 'root',
				size: 1,
				items: [
					{
						id: '1',
						size: 0.5,
					},
					{
						id: 'nested',
						size: 0.5,
						items: [
							{
								id: 'nested2',
								items: [],
								size: 0.5,
							},
							{
								id: 'nested3',
								items: [],
								size: 0.5,
							},
						],
					},
				],
			};
			const expected = normalizeLayout({
				...data,
				items: [
					{
						id: '1',
						size: 1,
					},
				],
			});
			expect(prepareLayout(data)).toEqual(expected);
		});
		it('should replace layout with single item with that item', () => {
			const data = {
				id: 'root',
				items: [
					{
						id: 'nested',
						items: [
							{
								id: 'nested2',
								items: [
									{
										id: '1',
									},
								],
							},
						],
					},
				],
			};
			const expected = normalizeLayout({
				...data,
				items: [
					{
						id: '1',
					},
				],
			});
			expect(flattenLayoutItems(normalizeLayout(data).items, data.id)).toEqual(expected.items);
		});
	});

	describe('setDefaults', () => {
		it('should set default orientation', () => {
			const data = {
				id: 'root',
				items: [
					{
						id: 'nested',
						items: [
							{
								id: '1',
							},
							{
								id: '2',
							},
						],
					},
				],
			};
			const normalized = setDefaults(normalizeLayout(data));
			const expected = normalizeLayout({
				...data,
				orientation: LayoutOrientation.Horizontal,
				items: [
					{
						...data.items[0],
						orientation: LayoutOrientation.Horizontal,
						items: data.items[0].items.map(item => ({
							...item,
						})),
					},
				],
			});
			Object.values(expected.items).forEach((item: object) => {
				delete item['size'];
				delete item['type'];
			});
			Object.values(normalized.items).forEach((item: object) => {
				delete item['size'];
				delete item['type'];
			});
			expect(normalized).toEqual(expected);
		});
		it('should set default sizes', () => {
			const data = {
				id: 'root',
				orientation: LayoutOrientation.Horizontal,
				type: LayoutModelItemType.Layout,
				items: [
					{
						id: 'nested',
						orientation: LayoutOrientation.Horizontal,
						type: LayoutModelItemType.Layout,
						items: [
							{
								id: '1',
								type: LayoutModelItemType.Plain,
							},
							{
								id: '2',
								type: LayoutModelItemType.Plain,
							},
						],
					},
				],
			};
			const normalized = normalizeLayout(data);
			const withDefaults = setDefaults(normalized);
			const expected = normalizeLayout({
				...data,
				size: 1,
				items: [
					{
						...data.items[0],
						size: 1,
						items: [
							{
								...data.items[0].items[0],
								size: 0.5,
							},
							{
								...data.items[0].items[1],
								size: 0.5,
							},
						],
					},
				],
			} as any);
			expect(withDefaults).toEqual(expected);
		});
		it('should set default item type', () => {
			const data = {
				id: 'root',
				items: [
					{
						id: '1',
					},
					{
						id: '2',
					},
				],
			};
			const expected = setDefaults(normalizeLayout(data));
			expect(expected.items['root'].type).toBe(LayoutModelItemType.Layout);
			expect(expected.items['1'].type).toBe(LayoutModelItemType.Plain);
			expect(expected.items['2'].type).toBe(LayoutModelItemType.Plain);
		});
	});

	describe('normalizeLayout', () => {
		it('should normalizeLayout with setting defaults', () => {
			const data: any = {
				id: 'root',
				orientation: LayoutOrientation.Vertical,
				size: 12,
				items: [
					{
						id: '1',
					},
					{
						id: 'nested',
						items: [
							{
								id: '2',
							},
							{
								id: '3',
							},
						],
					},
				],
			};
			const expected = {
				root_id: data.id,
				items: {
					[data.id]: {
						id: data.id,
						orientation: data.orientation,
						size: 1,
						parent_id: undefined,
						type: LayoutModelItemType.Layout,
						item_ids: data.items.map((item: any) => item.id),
					},
					[data.items[0].id]: {
						...data.items[0],
						size: 0.5,
						type: LayoutModelItemType.Plain,
						parent_id: data.id,
					},
					[data.items[1].id]: {
						id: data.items[1].id,
						parent_id: data.id,
						size: 0.5,
						type: LayoutModelItemType.Layout,
						orientation: LayoutOrientation.Horizontal,
						item_ids: data.items[1].items.map((item: any) => item.id),
					},
					[data.items[1].items[0].id]: {
						...data.items[1].items[0],
						type: LayoutModelItemType.Plain,
						size: 0.5,
						parent_id: data.items[1].id,
					},
					[data.items[1].items[1].id]: {
						...data.items[1].items[1],
						size: 0.5,
						type: LayoutModelItemType.Plain,
						parent_id: data.items[1].id,
					},
				},
			};
			expect(normalizeLayout(data)).toEqual(expected);
		});
	});

	describe('denormalizeLayout', () => {
		it('should denormalize layout', () => {
			const data = {
				id: 'root',
				orientation: LayoutOrientation.Horizontal,
				type: LayoutModelItemType.Layout,
				size: 1,
				items: [
					{
						id: '1',
						size: 0.5,
						type: LayoutModelItemType.Plain,
					},
					{
						id: 'nested',
						orientation: LayoutOrientation.Vertical,
						type: LayoutModelItemType.Layout,
						size: 0.5,
						items: [
							{
								id: '2',
								size: 0.5,
								type: LayoutModelItemType.Plain,
							},
							{
								id: '3',
								size: 0.5,
								type: LayoutModelItemType.Plain,
							},
						],
					},
				],
			};
			const normalized = normalizeLayout(data);
			const result = denormalizeLayout(normalized);
			expect(result).toEqual(data);
		});
	});

	describe('prepareLayout', () => {
		it('should make all layout preparations to raw denormalized data', () => {
			const data: any = {
				id: 'root',
				items: [
					{
						id: '1',
					},
					{
						nested: {
							id: 'nested',
							items: [
								{
									id: 'nested2',
									items: [
										{
											id: '2',
										},
										{
											id: '3',
											size: 80,
										},
									],
								},
							],
						},
					},
				],
			};
			const normalized = normalizeLayout(data);
			const items = flattenLayoutItems(normalized.items, normalized.root_id);
			const expected = setDefaults({
				...normalized,
				items,
			});
			const result = prepareLayout(data);
			expect(result).toEqual(expected);
		});
	});

	describe('fixFloatSizes', () => {
		it('should increase last value if others are floats', () => {
			const sizes = [1 / 3, 1 / 3, 1 / 3]; //33.33...
			const sum = 1; //1
			expect(fixFloatSizes(sizes, sum, 5)).toEqual([0.33333, 0.33333, 0.33334]);
		});
		it('should only use toFixed if items sum is greater than containerSize', () => {
			const sizes = [30.33333333333, 30.33333333333];
			expect(fixFloatSizes(sizes, 1, 5)).toEqual(sizes.map(size => Number(size.toFixed(5))));
		});
		it('should support all zeros', () => {
			expect(fixFloatSizes([0, 0, 0, 0], 1, 5)).toEqual([0, 0, 0, 0]);
		});
		it('should correctly round when zeros passed', () => {
			const containerSize = 17;
			const sizes = [containerSize / 3, containerSize / 3, containerSize / 3, 0];
			expect(fixFloatSizes(sizes, containerSize, 0)).toEqual([6, 6, 5, 0]);
		});
	});

	describe('normalizeSizes', () => {
		it('should return empty array', () => {
			const empty: number[] = [];
			const result = normalizeSizes(empty, 100, 0);
			expect(result).toEqual(empty);
			expect(result).not.toBe(empty);
		});
		it('should return [containerSize] if 1 item is passed', () => {
			expect(normalizeSizes([123], 10, 0)).toEqual([10]);
		});
		it('should reset all sizes to zero if zero containerSize is passed', () => {
			expect(normalizeSizes([123, 123, 123], 0, 0)).toEqual([0, 0, 0]);
		});
		it('should support zero values', () => {
			expect(normalizeSizes([1, 0], 1, 0)).toEqual([1, 0]);
		});
		it('should normalize sizes according to containerSize', () => {
			const sizes = [1, 2, 3];
			const sum = sizes.reduce((acc, size) => acc + size, 0);
			const expected = sizes.map(size => size * 2);
			expect(normalizeSizes(sizes, sum * 2, 0)).toEqual(expected);
		});
	});

	describe('getDefaultChildrenSizes', () => {
		const root: TLayoutItem<never> = {
			type: LayoutModelItemType.Layout,
			orientation: LayoutOrientation.Horizontal,
			size: 1,
			id: 'root',
			parent_id: '',
			item_ids: [],
		};
		const generate = (sizes: number[]): TLayoutStructure<never> => {
			const items: TLayoutItem<TMinimumLayoutModelItemProps>[] = sizes.map(size => {
				//noinspection UnnecessaryLocalVariableJS
				const item: TLayoutItem<TMinimumLayoutModelItemProps> = {
					type: LayoutModelItemType.Plain,
					size,
					id: uuid(),
					parent_id: root.id,
					props: minProps,
				};
				return item;
			});
			return {
				root_id: root.id,
				items: {
					...items.reduce((acc, item) => {
						acc[item.id] = item;
						return acc;
					}, {}),
					[root.id]: {
						...root,
						item_ids: items.map(item => item.id),
					},
				},
			};
		};
		it('should produce even values when size is not set', () => {
			let layout = generate(Array.from(new Array(2)));
			let root = layout.items[layout.root_id] as TLayoutModelLayout;
			expect(getDefaultChildrenSizes(layout, root, 1, 5)).toEqual([0.5, 0.5]);
			layout = generate(Array.from(new Array(4)));
			root = layout.items[layout.root_id] as TLayoutModelLayout;
			expect(getDefaultChildrenSizes(layout, root, 1, 5)).toEqual([0.25, 0.25, 0.25, 0.25]);
		});
		it('should respect already set sizes in items', () => {
			const sizes = [0.25, 0.45, 0.3];
			const layout = generate(sizes);
			const root = layout.items[layout.root_id] as TLayoutModelLayout;
			expect(getDefaultChildrenSizes(layout, root, 1, 5)).toEqual(sizes);
		});
	});

	describe('getPlaceholderPlacement', () => {
		const x1 = -1;
		const x2 = 1;
		const y1 = -2;
		const y2 = 2;
		it('return undefined if out of bounds', () => {
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 3, 0, 0, 0, false).side).not.toBeDefined();
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 3, 0, 0, 0, false).fits).toBe(false);
			expect(getPlaceholderPlacement(x1, y1, x2, y2, -3, 0, 0, 0, false).side).not.toBeDefined();
			expect(getPlaceholderPlacement(x1, y1, x2, y2, -3, 0, 0, 0, false).fits).toBe(false);
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 0, 3, 0, 0, false).side).not.toBeDefined();
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 0, 3, 0, 0, false).fits).toBe(false);
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 0, -3, 0, 0, false).side).not.toBeDefined();
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 0, -3, 0, 0, false).fits).toBe(false);
		});
		it('should return undefined if height or width is zero', () => {
			expect(getPlaceholderPlacement(1, 2, 1, 3, 0, 0, 0, 0, false).side).not.toBeDefined();
			expect(getPlaceholderPlacement(1, 2, 2, 2, 0, 0, 0, 0, false).side).not.toBeDefined();
		});
		it('should return ItemSide', () => {
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 0.5, 0, 0, 0, false)).toEqual({
				side: ItemSide.Right,
				fits: true,
			});
			expect(getPlaceholderPlacement(x1, y1, x2, y2, -0.5, 0, 0, 0, false)).toEqual({
				side: ItemSide.Left,
				fits: true,
			});
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 0, 0.5, 0, 0, false)).toEqual({
				side: ItemSide.Bottom,
				fits: true,
			});
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 0, -0.5, 0, 0, false)).toEqual({
				side: ItemSide.Top,
				fits: true,
			});
		});
		it('should correctly estimate edge cases', () => {
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 1, 0, 0, 0, false)).toEqual({
				side: ItemSide.Right,
				fits: true,
			});
			expect(getPlaceholderPlacement(x1, y1, x2, y2, -1, 0, 0, 0, false)).toEqual({
				side: ItemSide.Left,
				fits: true,
			});
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 0, -1, 0, 0, false)).toEqual({
				side: ItemSide.Top,
				fits: true,
			});
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 0, 1, 0, 0, false)).toEqual({
				side: ItemSide.Bottom,
				fits: true,
			});
			//
			// 	//zero is always top
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 0, 0, 0, 0, false)).toEqual({
				side: ItemSide.Top,
				fits: true,
			});
			//
			// // 	//corners
			// // 	//top-right
			expect(getPlaceholderPlacement(x1, y1, x2, y2, x2, y1, 0, 0, false)).toEqual({
				side: ItemSide.Top,
				fits: true,
			});
			// // 	//top-left
			expect(getPlaceholderPlacement(x1, y1, x2, y2, x1, y1, 0, 0, false)).toEqual({
				side: ItemSide.Top,
				fits: true,
			});
			// // 	//bottom-left
			expect(getPlaceholderPlacement(x1, y1, x2, y2, x1, y2, 0, 0, false)).toEqual({
				side: ItemSide.Bottom,
				fits: true,
			});
			// // 	//bottom-right
			expect(getPlaceholderPlacement(x1, y1, x2, y2, x2, y2, 0, 0, false)).toEqual({
				side: ItemSide.Bottom,
				fits: true,
			});
		});
		it('should support shifted coords', () => {
			const x1 = 3;
			const y1 = 3;
			const x2 = 7;
			const y2 = 9;
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 5, 3, 0, 0, false)).toEqual({
				side: ItemSide.Top,
				fits: true,
			});
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 3, 6, 0, 0, false)).toEqual({
				side: ItemSide.Left,
				fits: true,
			});
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 7, 6, 0, 0, false)).toEqual({
				side: ItemSide.Right,
				fits: true,
			});
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 5, 9, 0, 0, false)).toEqual({
				side: ItemSide.Bottom,
				fits: true,
			});
			//corners
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 3, 3, 0, 0, false)).toEqual({
				side: ItemSide.Top,
				fits: true,
			});
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 7, 3, 0, 0, false)).toEqual({
				side: ItemSide.Top,
				fits: true,
			});
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 3, 9, 0, 0, false)).toEqual({
				side: ItemSide.Bottom,
				fits: true,
			});
			expect(getPlaceholderPlacement(x1, y1, x2, y2, 7, 9, 0, 0, false)).toEqual({
				side: ItemSide.Bottom,
				fits: true,
			});
		});
		it("should return {fits: false} and side if there's not enough space", () => {
			expect(getPlaceholderPlacement(0, 0, 2, 2, 1, 1, 10, 0, false)).toEqual({
				side: ItemSide.Top,
				fits: false,
			});
			expect(getPlaceholderPlacement(0, 0, 2, 2, 0, 1, 10, 0, false)).toEqual({
				side: ItemSide.Left,
				fits: false,
			});
			expect(getPlaceholderPlacement(0, 0, 2, 2, 2, 1, 10, 0, false)).toEqual({
				side: ItemSide.Right,
				fits: false,
			});
			expect(getPlaceholderPlacement(0, 0, 2, 2, 1, 2, 10, 0, false)).toEqual({
				side: ItemSide.Bottom,
				fits: false,
			});
			expect(getPlaceholderPlacement(0, 0, 2, 2, 1, 1, 0, 10, false)).toEqual({
				side: ItemSide.Top,
				fits: false,
			});
			expect(getPlaceholderPlacement(0, 0, 2, 2, 0, 1, 0, 10, false)).toEqual({
				side: ItemSide.Left,
				fits: false,
			});
			expect(getPlaceholderPlacement(0, 0, 2, 2, 2, 1, 0, 10, false)).toEqual({
				side: ItemSide.Right,
				fits: false,
			});
			expect(getPlaceholderPlacement(0, 0, 2, 2, 1, 2, 0, 10, false)).toEqual({
				side: ItemSide.Bottom,
				fits: false,
			});
			expect(getPlaceholderPlacement(0, 0, 2, 2, 1, 1, 10, 10, false)).toEqual({
				side: ItemSide.Top,
				fits: false,
			});
			expect(getPlaceholderPlacement(0, 0, 2, 2, 0, 1, 10, 10, false)).toEqual({
				side: ItemSide.Left,
				fits: false,
			});
			expect(getPlaceholderPlacement(0, 0, 2, 2, 2, 1, 10, 10, false)).toEqual({
				side: ItemSide.Right,
				fits: false,
			});
			expect(getPlaceholderPlacement(0, 0, 2, 2, 1, 2, 10, 10, false)).toEqual({
				side: ItemSide.Bottom,
				fits: false,
			});
		});
	});

	describe('getResizeHandlerSide', () => {
		it('should return undefined for no items', () => {
			const sizes: number[] = [];
			expect(getResizeHandlerSide(sizes, 0)).not.toBeDefined();
		});
		it('should return undefined for one item', () => {
			const sizes = [100];
			expect(getResizeHandlerSide(sizes, 0)).not.toBeDefined();
		});
		it('should return correct side', () => {
			const sizes = [33, 33, 34];
			expect(getResizeHandlerSide(sizes, 0)).toBe(ResizeHandlerSide.After);
			expect(getResizeHandlerSide(sizes, 1)).toBe(ResizeHandlerSide.Both);
			expect(getResizeHandlerSide(sizes, 2)).toBe(ResizeHandlerSide.Before);
		});
		it('should ignore items with size 0', () => {
			expect(getResizeHandlerSide([0, 50, 50], 0)).not.toBeDefined();
			expect(getResizeHandlerSide([50, 0, 50], 1)).not.toBeDefined();
			expect(getResizeHandlerSide([50, 50, 0], 2)).not.toBeDefined();
		});
		it('should lookup to the left for items with sizes 0', () => {
			expect(getResizeHandlerSide([0, 0, 100], 2)).not.toBeDefined();
		});
		it('should lookup to the right for items with sizes 0', () => {
			expect(getResizeHandlerSide([100, 0, 0], 0)).not.toBeDefined();
		});
		it('should lookup to both directions for items with sizes 0 in the middle', () => {
			expect(getResizeHandlerSide([0, 50, 50], 1)).toBe(ResizeHandlerSide.After);
			expect(getResizeHandlerSide([50, 50, 0], 1)).toBe(ResizeHandlerSide.Before);
			expect(getResizeHandlerSide([50, 50, 50], 1)).toBe(ResizeHandlerSide.Both);
			expect(getResizeHandlerSide([0, 50, 50, 50], 1)).toBe(ResizeHandlerSide.After);
			expect(getResizeHandlerSide([50, 50, 50, 0], 1)).toBe(ResizeHandlerSide.Both);
			expect(getResizeHandlerSide([0, 50, 50, 50], 2)).toBe(ResizeHandlerSide.Both);
			expect(getResizeHandlerSide([50, 50, 50, 0], 2)).toBe(ResizeHandlerSide.Before);

			expect(getResizeHandlerSide([0, 50, 50, 50, 0], 2)).toBe(ResizeHandlerSide.Both);
			expect(getResizeHandlerSide([0, 50, 0], 1)).not.toBeDefined();
		});
	});

	describe('setTransferData', () => {
		it('should correctly set data in text format', () => {
			const setData = jest.fn();
			//noinspection JSValidateTypes
			/**
			 * @type {DragEvent}
			 */
			const event = {
				dataTransfer: {
					setData,
				},
			};
			const data = {
				foo: 'bar',
			};
			setTransferData(event as any, data);
			expect(setData).toHaveBeenCalledWith('text', JSON.stringify(data));
		});
		it('should merge existing values', () => {
			const setData = jest.fn();
			const data = {
				foo: 'bar',
			};
			//noinspection JSValidateTypes
			/**
			 * @type {DragEvent}
			 */
			const event = {
				dataTransfer: {
					setData,
					getData() {
						return JSON.stringify(data);
					},
				},
			};
			const newData = {
				bar: 'foo',
			};
			setTransferData(event as any, newData);
			expect(setData).toHaveBeenCalledWith(
				'text',
				JSON.stringify({
					...data,
					...newData,
				}),
			);
		});
	});

	describe('setDragData', () => {
		it('should set data under specific key', () => {
			const data = {
				foo: 'bar',
			};
			const setData = jest.fn();
			//noinspection JSValidateTypes
			/**
			 * @type {DragEvent}
			 */
			const event = {
				dataTransfer: {
					setData,
				},
			};
			setDragData(event as any, data);
			expect(setData).toHaveBeenCalledWith(
				'text',
				JSON.stringify({
					[NATIVE_DRAG_DATA_KEY]: data,
				}),
			);
		});
	});

	describe('countChildren', () => {
		const id1 = '1';
		const id2 = '2';
		const id3 = '3';
		const id4 = '4';
		const id5 = '5';
		const id6 = '6';
		const nested1 = 'nested1';
		const nested2 = 'nested2';
		const root = 'root';
		const layout: any = prepareLayout({
			id: root,
			orientation: LayoutOrientation.Horizontal,
			items: [
				{
					id: id1,
				},
				{
					id: id2,
				},
				{
					id: nested1,
					orientation: LayoutOrientation.Vertical,
					items: [
						{
							id: id3,
						},
						{
							id: id4,
						},
						{
							id: nested2,
							orientation: LayoutOrientation.Horizontal,
							items: [
								{
									id: id5,
								},
								{
									id: id6,
								},
							],
						},
					],
				},
			],
		});
		it('should return 1 for plain items', () => {
			expect(layout.items[id1].item_ids).not.toBeDefined();
			expect(countChildren(layout, layout.items[id1], LayoutOrientation.Horizontal)).toBe(1);
			expect(countChildren(layout, layout.items[id1], LayoutOrientation.Vertical)).toBe(1);
		});
		it('should count horizontally', () => {
			expect(countChildren(layout, layout.items[root], LayoutOrientation.Horizontal)).toBe(4);
			expect(countChildren(layout, layout.items[nested1], LayoutOrientation.Horizontal)).toBe(2);
			expect(countChildren(layout, layout.items[nested2], LayoutOrientation.Horizontal)).toBe(2);
		});
		it('should count vertically', () => {
			expect(countChildren(layout, layout.items[root], LayoutOrientation.Vertical)).toBe(3);
			expect(countChildren(layout, layout.items[nested1], LayoutOrientation.Vertical)).toBe(3);
			expect(countChildren(layout, layout.items[nested2], LayoutOrientation.Vertical)).toBe(1);
		});
	});

	describe('chooseByOrientation', () => {
		it('should choose correctly', () => {
			expect(chooseByOrientation(1, 2, LayoutOrientation.Vertical)).toBe(2);
			expect(chooseByOrientation(1, 2, LayoutOrientation.Horizontal)).toBe(1);
		});
	});

	describe('generateWrapperLayout', () => {
		describe('should generate wrapper layout when inserting at', () => {
			const id = 'id';
			const parent_id = 'parent';
			const destination_id = 'destination';
			const destination: TLayoutItem<TMinimumLayoutModelItemProps> = {
				type: LayoutModelItemType.Plain,
				id: destination_id,
				size: 100,
				parent_id,
				props: minProps,
			};
			const parent: TLayoutItem<TMinimumLayoutModelItemProps> = {
				type: LayoutModelItemType.Layout,
				id: parent_id,
				parent_id: 'root',
				size: 100,
				orientation: LayoutOrientation.Horizontal,
				item_ids: [destination_id],
			};
			it('ItemSide.Top', () => {
				const result = generateWrapperLayout(id, destination, parent, ItemSide.Top);
				expect(result).toEqual({
					size: 100,
					parent_id,
					type: LayoutModelItemType.Layout,
					id: jasmine.any(String),
					orientation: LayoutOrientation.Vertical,
					item_ids: [id, destination_id],
				});
			});
			it('ItemSide.Bottom', () => {
				const result = generateWrapperLayout(id, destination, parent, ItemSide.Bottom);
				expect(result).toEqual({
					size: 100,
					parent_id,
					type: LayoutModelItemType.Layout,
					id: jasmine.any(String),
					orientation: LayoutOrientation.Vertical,
					item_ids: [destination_id, id],
				});
			});
			it('ItemSide.Left', () => {
				const result = generateWrapperLayout(id, destination, parent, ItemSide.Left);
				expect(result).toEqual({
					size: 100,
					parent_id,
					type: LayoutModelItemType.Layout,
					id: jasmine.any(String),
					orientation: LayoutOrientation.Horizontal,
					item_ids: [id, destination_id],
				});
			});
			it('ItemSide.Right', () => {
				const result = generateWrapperLayout(id, destination, parent, ItemSide.Right);
				expect(result).toEqual({
					size: 100,
					parent_id,
					type: LayoutModelItemType.Layout,
					id: jasmine.any(String),
					orientation: LayoutOrientation.Horizontal,
					item_ids: [destination_id, id],
				});
			});
		});
	});

	describe('getSizeMap', () => {
		const layout = prepareLayout({
			id: '1',
			orientation: LayoutOrientation.Vertical,
			items: [
				{
					id: '3',
					orientation: LayoutOrientation.Horizontal,
					items: [
						{
							size: 0.1,
							id: '4',
						},
						{
							size: 0.9,
							id: '5',
						},
					],
				},
				{
					id: '2',
					orientation: LayoutOrientation.Horizontal,
					items: [
						{
							id: '6',
						},
						{
							id: '7',
							orientation: LayoutOrientation.Vertical,
							items: [
								{
									size: 0.1,
									id: '8',
								},
								{
									size: 0.9,
									id: '9',
								},
							],
						},
					],
				},
			],
		});
		const minSize = 0.5;
		const precision = 2;
		it('should return either passed sizes or minimal size for plain item', () => {
			const item = layout.items['9'];
			expect(getSizeMap(layout, item, minSize, minSize, 1, 1, 0, precision)).toEqual({
				[item.id]: {
					width: 1,
					height: 1,
				},
			});

			expect(getSizeMap(layout, item, minSize, minSize, 0.1, 1, 0, precision)).toEqual({
				[item.id]: {
					width: minSize,
					height: 1,
				},
			});

			expect(getSizeMap(layout, item, minSize, minSize, 1, 0.1, 0, precision)).toEqual({
				[item.id]: {
					width: 1,
					height: minSize,
				},
			});
		});
		it('should respect min width for vertical layout and min height for horizontal', () => {
			const vertical = layout.items['7'];
			expect(getSizeMap(layout, vertical, minSize, minSize, 2, 2, 0, precision)[vertical.id]).toEqual({
				width: 2,
				height: jasmine.any(Number),
			});
			expect(getSizeMap(layout, vertical, minSize, minSize, 0, 2, 0, precision)[vertical.id]).toEqual({
				width: minSize,
				height: jasmine.any(Number),
			});

			const horizontal = layout.items['3'];
			expect(getSizeMap(layout, horizontal, minSize, minSize, 2, 2, 0, precision)[horizontal.id]).toEqual({
				width: jasmine.any(Number),
				height: 2,
			});
			expect(getSizeMap(layout, horizontal, minSize, minSize, 2, 0, 0, precision)[horizontal.id]).toEqual({
				width: jasmine.any(Number),
				height: minSize,
			});
		});
		describe('should compose size from nested plain items for layout and respect minimal size', () => {
			describe('for vertical layout', () => {
				it('', () => {
					const vertical = layout.items['7'] as TLayoutModelLayout;
					const width = 1;
					const height = 2;
					//min-size: 0.1
					expect(getSizeMap(layout, vertical, 0.1, 0.1, width, height, 0, precision)).toEqual({
						[vertical.id]: {
							width,
							height,
						},
						...vertical.item_ids.reduce((acc, id) => {
							const item = layout.items[id];
							acc[id] = {
								width,
								height: height * item.size,
							};
							return acc;
						}, {}),
					});
				});
			});

			describe('for horizontal layout', () => {
				it('', () => {
					const horizontal = layout.items['3'] as TLayoutModelLayout;
					const width = 2;
					const height = 1;
					//min-size: 0.1
					expect(getSizeMap(layout, horizontal, 0.1, 0.1, width, height, 0, precision)).toEqual({
						[horizontal.id]: {
							width,
							height,
						},
						...horizontal.item_ids.reduce((acc, id) => {
							const item = layout.items[id];
							acc[id] = {
								width: width * item.size,
								height,
							};
							return acc;
						}, {}),
					});
				});
			});
		});
		describe('when increasing', () => {
			describe('height of nested vertical layout', () => {
				it('should also increase height of all horizontal siblings', () => {
					const layout = prepareLayout({
						id: 'root',
						orientation: LayoutOrientation.Horizontal,
						size: 13,
						items: [
							{
								id: 'a',
								size: 6,
							},
							{
								id: 'bc',
								orientation: LayoutOrientation.Vertical,
								size: 3,
								items: [
									{
										id: 'b',
										size: 3,
									},
									{
										id: 'c',
										size: 3,
									},
								],
							},
							{
								id: 'def',
								orientation: LayoutOrientation.Vertical,
								size: 4,
								items: [
									{
										id: 'd',
										size: 3,
									},
									{
										id: 'e',
										size: 3,
									},
									{
										id: 'f',
										size: 3,
									},
								],
							},
						],
					});
					const result = getSizeMap(layout, layout.items[layout.root_id], 3, 3, 13, 5, 0, 2);
					const expectedHeight = 9;
					const expected = {
						a: {
							width: 6,
							height: expectedHeight,
						},
						b: {
							width: 3,
							height: 4.5,
						},
						c: {
							width: 3,
							height: 4.5,
						},
						d: {
							width: 4,
							height: 3,
						},
						e: {
							width: 4,
							height: 3,
						},
						f: {
							width: 4,
							height: 3,
						},
						bc: {
							width: 3,
							height: expectedHeight,
						},
						def: {
							width: 4,
							height: expectedHeight,
						},
						root: {
							width: 13,
							height: expectedHeight,
						},
					};
					expect(result).toEqual(expected);
				});
			});
			describe('width of nested horizontal layout', () => {
				it('should also increase width of all vertical siblings', () => {
					const layout = prepareLayout({
						id: 'root',
						orientation: LayoutOrientation.Vertical,
						size: 9,
						items: [
							{
								id: 'a',
								size: 3,
							},
							{
								id: 'bc',
								orientation: LayoutOrientation.Horizontal,
								size: 3,
								items: [
									{
										id: 'b',
										size: 3,
									},
									{
										id: 'c',
										size: 3,
									},
								],
							},
							{
								id: 'def',
								orientation: LayoutOrientation.Horizontal,
								size: 3,
								items: [
									{
										id: 'd',
										size: 3,
									},
									{
										id: 'e',
										size: 3,
									},
									{
										id: 'f',
										size: 3,
									},
								],
							},
						],
					});
					const result = getSizeMap(layout, layout.items[layout.root_id], 3, 3, 5, 9, 0, 2);
					const expectedWidth = 9;
					const expected = {
						a: {
							width: expectedWidth,
							height: 3,
						},
						b: {
							width: expectedWidth / 2,
							height: 3,
						},
						c: {
							width: expectedWidth / 2,
							height: 3,
						},
						d: {
							width: expectedWidth / 3,
							height: 3,
						},
						e: {
							width: expectedWidth / 3,
							height: 3,
						},
						f: {
							width: expectedWidth / 3,
							height: 3,
						},
						bc: {
							width: expectedWidth,
							height: 3,
						},
						def: {
							width: expectedWidth,
							height: 3,
						},
						root: {
							width: expectedWidth,
							height: 9,
						},
					};
					expect(result).toEqual(expected);
				});
			});
		});
		it('should correctly set sizes when processing empty layouts', () => {
			const data = {
				id: 'root',
				orientation: LayoutOrientation.Horizontal,
				size: 1,
				items: [],
			};
			const layout = prepareLayout(data);
			const sizeMap = getSizeMap(layout, layout.items['root'], 100, 100, 100, 100, 0, 5);
			const expected = {
				root: {
					width: 100,
					height: 100,
				},
			};
			expect(sizeMap).toEqual(expected);
		});
		it('should shrink vertical siblings', () => {
			const data = {
				id: 'root',
				orientation: LayoutOrientation.Vertical,
				size: 1,
				items: [
					{
						id: '1',
						size: 0.4,
					},
					{
						id: '2',
						size: 0.2,
					},
					{
						id: '3',
						size: 0.4,
					},
				],
			};
			const layout = prepareLayout(data);
			const sizeMap = getSizeMap(layout, layout.items['root'], 2, 2, 10, 8, 0, 5);
			expect(sizeMap['1'].height).toBe(3);
			expect(sizeMap['2'].height).toBe(2);
			expect(sizeMap['3'].height).toBe(3);
		});
		it('should shrink horizontal siblings', () => {
			const data = {
				id: 'root',
				orientation: LayoutOrientation.Horizontal,
				size: 1,
				items: [
					{
						id: '1',
						size: 0.4,
					},
					{
						id: '2',
						size: 0.2,
					},
					{
						id: '3',
						size: 0.4,
					},
				],
			};
			const layout = prepareLayout(data);
			const sizeMap = getSizeMap(layout, layout.items['root'], 2, 2, 8, 10, 0, 5);
			expect(sizeMap['1'].width).toBe(3);
			expect(sizeMap['2'].width).toBe(2);
			expect(sizeMap['3'].width).toBe(3);
		});
	});
	describe('getMinWidth', function() {
		it('should pick default for nested layout', () => {
			assert(
				property(
					integer(),
					minWidth =>
						getMinWidth(
							{
								id: '123',
								type: LayoutModelItemType.Layout,
								parent_id: 'root',
								size: 1,
								orientation: LayoutOrientation.Horizontal,
								item_ids: [],
							},
							minWidth,
						) === minWidth,
				),
			);
		});
		it('should get minWidth from props', () => {
			assert(
				property(
					integer(),
					integer(),
					(minWidth, defaultMinWidth) =>
						getMinWidth(
							{
								id: 'foo',
								type: LayoutModelItemType.Plain,
								size: 1,
								parent_id: 'root',
								props: {
									minWidth,
									minHeight: 0,
								},
							},
							defaultMinWidth,
						) === minWidth,
				),
			);
		});
	});
	describe('getMinHeight', function() {
		it('should pick default for nested layout', () => {
			assert(
				property(
					integer(),
					minHeight =>
						getMinHeight(
							{
								id: '123',
								type: LayoutModelItemType.Layout,
								parent_id: 'root',
								size: 1,
								orientation: LayoutOrientation.Horizontal,
								item_ids: [],
							},
							minHeight,
						) === minHeight,
				),
			);
		});
		it('should get minHeight from props', () => {
			assert(
				property(
					integer(),
					integer(),
					(minHeight, defaultHeight) =>
						getMinHeight(
							{
								id: 'foo',
								type: LayoutModelItemType.Plain,
								size: 1,
								parent_id: 'root',
								props: {
									minWidth: 0,
									minHeight,
								},
							},
							defaultHeight,
						) === minHeight,
				),
			);
		});
	});
});
