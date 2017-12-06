import Emitter from '../emitter/Emitter';

export const ERROR_NOT_FOUND = 'Item not found';

export const ERROR_READONLY = 'Collection is readonly';

export const E_COLLECTION = {
	ITEM_ADD: 'COLLECTION:ITEM_ADD',
	ITEM_REMOVE: 'COLLECTION:ITEM_REMOVE',
	CLEAR: 'COLLECTION:CLEAR',
	CHANGE: 'COLLECTION:CHANGE'
};

export type TCollectionOptions = {
	readonly?: boolean;
};

/**
 * Basic observable collection
 */
export class Collection<T> extends Emitter {
	private _items: T[];
	private _options: TCollectionOptions;

	/**
	 * Length
	 */
	get length(): number {
		return this._items.length;
	}

	/**
	 * Items copy
	 */
	get items(): T[] {
		return this._items.slice();
	}

	constructor(items: T[] = [], options: TCollectionOptions = {}) {
		super();

		this._options = {
			...options
		};

		this._items = items.slice();
	}

	/**
	 * Returns fresh new shiny copy of collection
	 */
	clone(options: TCollectionOptions = {}): Collection<T> {
		return new Collection(this._items.slice(), Object.assign({}, this._options, options));
	}

	/**
	 * Adds item to collection
	 */
	add(item: T) {
		this._requireWriteAccess();
		this._items.push(item);
		this._emit(E_COLLECTION.ITEM_ADD, item);
		this._emit(E_COLLECTION.CHANGE);
	}

	/**
	 * Removes item from collection
	 */
	remove(item: T) {
		this._requireWriteAccess();
		const index = this._items.indexOf(item);
		if (index !== -1) {
			this._items.splice(index, 1);
			this._emit(E_COLLECTION.ITEM_REMOVE, item);
			this._emit(E_COLLECTION.CHANGE);
		}
	}

	/**
	 * Clears collection
	 */
	clear() {
		this._requireWriteAccess();
		this._items.length = 0;
		this._emit(E_COLLECTION.CHANGE);
		this._emit(E_COLLECTION.CLEAR);
	}

	/**
	 * Tries to find element by callback and throw if not found
	 * @throws
	 */
	find(callback: (element: T, index: number) => boolean): T {
		//do not pass callback directly to not give access to items arrays as 3rd argument
		const item = this._items.find((element, index) => callback(element, index));
		if (typeof item !== 'undefined') {
			return item;
		} else {
			throw new Error(ERROR_NOT_FOUND);
		}
	}

	/**
	 * Filters collection by callback
	 */
	filter(callback: (element: T, index: number) => boolean): T[] {
		//do not pass callback directly to not give access to items arrays as 3rd argument
		return this._items.filter((element, index) => callback(element, index));
	}

	/**
	 * Iterates over collection
	 */
	forEach(callback: (element: T, index: number) => void) {
		//do not pass callback directly to not give access to items arrays as 3rd argument
		this._items.forEach((element, index) => callback(element, index));
	}

	/**
	 * Maps collection with callback
	 */
	map<U>(callback: (element: T, index: number) => U): U[] {
		//do not pass callback directly to not give access to items arrays as 3rd argument
		return this._items.map((element, index) => callback(element, index));
	}

	/**
	 * Reduces collection with callback and initial value
	 */
	reduce<U>(callback: (acc: U, element: T, index: number) => U, initial: U): U {
		//do not pass callback directly to not give access to items arrays as 3rd argument
		return this._items.reduce((acc, element, index) => callback(acc, element, index), initial);
	}

	/**
	 * Checks if any element satisfies callback
	 */
	some(callback: (element: T, index: number) => boolean): boolean {
		return this._items.some((element, index) => callback(element, index));
	}

	/**
	 * Checks if every element satisfies callback
	 */
	every(callback: (element: T, index: number) => boolean): boolean {
		return this._items.every((element, index) => callback(element, index));
	}

	/**
	 * Checks if collection contains item
	 */
	contains(item: T): boolean {
		return this._items.indexOf(item) !== -1;
	}

	/**
	 * Checks if collection is not readonly and throws if it is
	 * @throws
	 */
	private _requireWriteAccess() {
		if (this._options.readonly) {
			throw new Error(ERROR_READONLY);
		}
	}
}

export default Collection;