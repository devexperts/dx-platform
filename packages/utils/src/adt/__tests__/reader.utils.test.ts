import { ask, asks } from 'fp-ts/lib/Reader';
import { combineReader, deferReader } from '../reader.utils';

type TFirst = {
	foo: number;
};

type TSecond = {
	bar: string;
};

describe('Reader utils', () => {
	describe('combine', () => {
		it('should combine context of provided readers', () => {
			const first = asks((e: TFirst) => 1);
			const second = asks((e: TSecond) => 2);

			const combined = combineReader(first, second, (a, b) => 1 + 2);

			expect(
				combined({
					foo: 2,
					bar: 'bar',
				}),
			).toBe(3);
		});

		it('should be possible to use each components with bundled context', () => {
			const fn = jest.fn();
			const first = asks((e: TFirst) => () => fn(e.foo));
			const second = asks((e: TSecond) => () => fn(e.bar));

			const combined = combineReader(first, second, (a, b) => {
				a();
				expect(fn).toHaveBeenCalledWith(2);
				b();
				expect(fn).toHaveBeenCalledWith('bar');
			});

			combined({
				foo: 2,
				bar: 'bar',
			});
		});
	});

	describe('deferReader', () => {
		it('should defer part of the context', () => {
			type E = TFirst & TSecond;
			const result = deferReader(ask<E>(), 'foo');
			const withBar = result({
				bar: '123',
			});
			const resolved = withBar({
				foo: 123,
			});
			expect(resolved).toBe(0);
		});
	});
});
