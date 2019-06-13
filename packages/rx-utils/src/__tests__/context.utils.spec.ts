import { combineContext, context, Context, deferContext } from '../context.utils';
import { Sink } from '../sink.utils';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

type E = { foo: string; bar: number };

describe('Context', () => {
	describe('deferContext', () => {
		it('should subscribe to inner Sink', () => {
			const cb = jest.fn();
			const effect$ = of(undefined).pipe(tap(cb));
			const fa = new Context((e: E) => new Sink(e.foo, effect$));
			const split = deferContext(fa, 'foo');
			const fa1 = split.run({ bar: 123 });
			const fa2 = fa1.value.run({ foo: '123' });
			fa2.sink$.subscribe();
			expect(cb).toBeCalled();
		});
	});

	describe('combineContext', () => {
		it('should subscribe to Sink returned from project', () => {
			const cb = jest.fn();
			const effect$ = of(undefined).pipe(tap(cb));
			const fa = context.of(1);
			const fb = context.of(2);
			const result = combineContext(fa, fb)((a, b) => new Sink(a + b, effect$)).run({});
			expect(result.value).toBe(3);
			result.sink$.subscribe();
			expect(cb).toBeCalled();
		});
		it('should support plain values returns from project', () => {
			const fa = context.of(1);
			const fb = context.of(2);
			const result = combineContext(fa, fb)((a, b) => a + b).run({});
			expect(result.value).toBe(3);
		});
	});
});
