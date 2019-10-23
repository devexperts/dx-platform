import { createHandler } from '../create-handler.utils';
import { Endomorphism, Lazy } from 'fp-ts/lib/function';

interface VoidThunk<A> {
	(a: A): void;
}
describe('create-handler.utils.ts', function() {
	describe('createHandler', function() {
		it('should not fail', function() {
			const a = createHandler();
			const af1: Lazy<void> = a.handle;
			const af2: Endomorphism<void> = a.handle;
			a.handle();
			af1();
			af2(undefined);

			const b = createHandler<void>();
			b.handle();
			const bf1: Lazy<void> = b.handle;
			const bf2: Endomorphism<void> = b.handle;
			bf1();
			bf2(undefined);

			const c = createHandler<string>();
			c.handle('');
			const cf3: VoidThunk<string> = c.handle;
			cf3('');

			const d = createHandler<boolean>();
			d.handle(true);
			const df1: VoidThunk<boolean> = d.handle;
			df1(true);

			const e = createHandler<'a' | 'b'>();
			e.handle('a');
			const ef1: VoidThunk<'a' | 'b'> = e.handle;
			ef1('b');
		});
	});
});
