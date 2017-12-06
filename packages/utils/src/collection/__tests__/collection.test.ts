import Collection, { E_COLLECTION } from '../Collection';

describe('Collection', () => {
	let collection: Collection<number>;

	beforeEach(() => {
		collection = new Collection([1, 2, 3]);
	});

	it('should create collection with passed elements', () => {
		expect(collection.contains(1)).toBeTruthy();
		expect(collection.contains(2)).toBeTruthy();
		expect(collection.contains(3)).toBeTruthy();
		expect(collection.contains(4)).toBeFalsy();
	});

	it('should add items', () => {
		expect(collection.contains(4)).toBeFalsy();
		const onAdd = jest.fn();
		const onChange = jest.fn();
		collection.on(E_COLLECTION.ITEM_ADD, onAdd);
		collection.on(E_COLLECTION.CHANGE, onChange);
		collection.add(4);
		collection.off(E_COLLECTION.ITEM_ADD, onAdd);
		collection.off(E_COLLECTION.CHANGE, onChange);
		expect(onAdd.mock.calls).toEqual([[4]]);
		expect(onChange.mock.calls.length).toBe(1);
		expect(collection.contains(4)).toBeTruthy();
	});

	it('should remove items', () => {
		expect(collection.contains(1)).toBeTruthy();
		const onRemove = jest.fn();
		const onChange = jest.fn();
		const unsubscribe = collection.on(E_COLLECTION.ITEM_REMOVE, onRemove);
		collection.on(E_COLLECTION.CHANGE, onChange);
		collection.remove(1);
		unsubscribe();
		collection.off(E_COLLECTION.CHANGE, onChange);
		expect(onRemove.mock.calls).toEqual([[1]]);
		expect(onChange.mock.calls.length).toBe(1);
		expect(collection.contains(1)).toBeFalsy();
	});

	it('should clear', () => {
		const onClear = jest.fn();
		const onChange = jest.fn();
		collection.on(E_COLLECTION.CLEAR, onClear);
		collection.on(E_COLLECTION.CHANGE, onChange);
		collection.clear();
		collection.off(E_COLLECTION.CLEAR, onClear);
		collection.off(E_COLLECTION.CHANGE, onChange);
		expect(onClear.mock.calls.length).toBe(1);
		expect(onChange.mock.calls.length).toBe(1);
		expect(collection.contains(1)).toBeFalsy();
		expect(collection.contains(2)).toBeFalsy();
		expect(collection.contains(3)).toBeFalsy();
	});

	it('should provide length getter', () => {
		collection.clear();
		expect(collection.length).toBe(0);
		collection.add(1);
		collection.add(2);
		expect(collection.length).toBe(2);
		collection.remove(2);
		expect(collection.length).toBe(1);
	});

	it('should prove items getter and return a copy', () => {
		collection.clear();
		collection.add(1);
		const items = collection.items;
		collection.add(2);
		expect(items).toEqual([1]);
	});

	it('should find and throw', () => {
		expect(collection.find(item => item === 1)).toBe(1);
		expect(collection.find.bind(null, (item: number) => item === 4)).toThrow();
	});

	it('should filter', () => {
		expect(collection.filter(item => item === 1 || item === 2)).toEqual([1, 2]);
	});

	it('should iterate', () => {
		const callback = jest.fn();
		collection.forEach(callback);
		expect(callback.mock.calls.length).toBe(3);
		expect(callback.mock.calls[0][0]).toBe(1);
		expect(callback.mock.calls[1][0]).toBe(2);
		expect(callback.mock.calls[2][0]).toBe(3);
	});

	it('should map', () => {
		expect(collection.map(item => item * item)).toEqual([1, 4, 9]);
	});

	it('should reduce', () => {
		expect(collection.reduce<number[]>((acc, item, i) => {
			acc.push(0);
			acc.push(item);
			return acc;
		}, [])).toEqual([0, 1, 0, 2, 0, 3]);
	});

	it('should some', () => {
		expect(collection.some(item => item === 1)).toBeTruthy();
		expect(collection.some(item => item === 4)).toBeFalsy();
	});

	it('should every', () => {
		expect(collection.every(item => [1, 2, 3].indexOf(item) !== -1));
		expect(collection.every(item => item === 4)).toBeFalsy();
	});

	it('should clone', () => {
		const clone = collection.clone();
		expect(clone !== collection).toBeTruthy();
	});

	it('should support readonly mode', () => {
		check(new Collection([1], {
			readonly: true
		}));

		check(new Collection([1]).clone({
			readonly: true
		}));

		function check<T>(collection: Collection<T>) {
			expect(collection.add.bind(null, 1)).toThrow();
			expect(collection.remove.bind(null, 1)).toThrow();
			expect(collection.clear.bind(null)).toThrow();
		}
	});
});