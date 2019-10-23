import { createHandler } from '../create-handler.utils';
import { Endomorphism, Lazy } from 'fp-ts/lib/function';
import { constVoid } from 'fp-ts/lib/function';

interface VoidThunk<A> {
	(a: A): void;
}

describe('create-handler.utils.ts', function() {
	describe('createHandler', function() {
		it('should not fail', function() {
			const a = createHandler();
			const af1: Lazy<void> = a.handle; // adds possibility to use handle as Lazy<void>
			const af2: Endomorphism<void> = a.handle; // keeps possibility to use as Endomorphism<void>
			a.handle();
			a.handle(undefined);
			a.handle(constVoid());
			af1(); // no argument is needed
			af2(undefined); // still can pass undefined

			const b = createHandler<void>(); // the same as above
			b.handle();
			b.handle(undefined);
			b.handle(constVoid());
			const bf1: Lazy<void> = b.handle;
			const bf2: Endomorphism<void> = b.handle;
			bf1();
			bf2(undefined);

			const c = createHandler<string>();
			const cf3: VoidThunk<string> = c.handle;
			cf3('');

			const d = createHandler<boolean>();
			const df1: VoidThunk<boolean> = d.handle;
			df1(true);

			const e = createHandler<'a' | 'b'>();
			e.handle('a');
			const ef1: VoidThunk<'a' | 'b'> = e.handle;
			ef1('b');
		});
	});
});
