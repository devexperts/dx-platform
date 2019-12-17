export const LAYOUT = Symbol('Layout') as symbol;

export type LAYOUT_THEME = {
	container?: string;
	container_horizontal?: string;
	container_vertical?: string;
	item?: string;
	item_nested?: string;
	item_horizontal?: string;
	item_vertical?: string;
	placeholder?: string;
	placeholder_maximized?: string;
	placeholder_fits?: string;
	placeholder_bottom?: string;
	placeholder_top?: string;
	placeholder_left?: string;
	placeholder_right?: string;
	placeholder_full?: string;
	resizeHandler?: string;
	resizeHandler_disabled?: string;
	fixedContainer?: string;
	Scrollable?: {};
};

export enum ItemSide {
	Top = 'Top',
	Bottom = 'Bottom',
	Left = 'Left',
	Right = 'Right',
}

export enum E_LAYOUT {
	ITEM_DROP,
}

export enum LayoutOrientation {
	Horizontal,
	Vertical,
}

type BASE_ITEM_SHAPE = {
	id: string;
	size?: number;
	parent_id?: string;
};

export type ITEM_SHAPE = BASE_ITEM_SHAPE & {
	props: object;
};

export type LAYOUT_SHAPE = BASE_ITEM_SHAPE & {
	items: Array<object | ITEM_SHAPE>;
	item_ids: Array<string>;
	orientation: LayoutOrientation;
};

export type LAYOUT_VALUE_SHAPE = {
	root_id: string;
	items: Array<ITEM_SHAPE | LAYOUT_SHAPE>;
};

export type LAYOUT_SIZE_MAP_TYPE = { [s: string]: number };

export enum ResizeHandlerSide {
	Before,
	After,
	Both,
}

export const NATIVE_DRAG_DATA_KEY = '__NATIVE_DRAG_DATA_KEY__';
export const SESSION_ID_KEY = '__SESSION_ID_KEY__';

export enum LayoutModelItemType {
	Plain,
	Layout,
}

export type TLayoutModelBase = {
	readonly id: string;
	readonly parent_id: string;
	readonly size: number;
};

export type TMinimumLayoutModelItemProps = {
	readonly minWidth?: number;
	readonly minHeight?: number;
};

export type TLayoutModelItem<P extends TMinimumLayoutModelItemProps> = TLayoutModelBase & {
	readonly type: LayoutModelItemType.Plain;
	readonly props?: P;
};

export type TLayoutModelLayout = TLayoutModelBase & {
	readonly type: LayoutModelItemType.Layout;
	readonly item_ids: Array<string>;
	readonly orientation: LayoutOrientation;
};

export type TLayoutItem<P extends TMinimumLayoutModelItemProps> = TLayoutModelItem<P> | TLayoutModelLayout;

export type TLayoutStructure<P extends TMinimumLayoutModelItemProps> = {
	readonly root_id: string;
	readonly items: Record<string, TLayoutItem<P>>;
};

export type TDenormalizedLayout<P extends TMinimumLayoutModelItemProps> = {
	readonly id: string;
	readonly size?: number;
	readonly orientation?: LayoutOrientation;
	readonly props?: P;
	readonly items?: Array<TDenormalizedLayout<P>>;
};
