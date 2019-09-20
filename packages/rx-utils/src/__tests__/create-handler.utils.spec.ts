import { createHandler } from '../create-handler.utils';
import { Endomorphism, Lazy } from 'fp-ts/lib/function';

describe('create-handler.utils.ts', function() {
	describe('createHandler', function() {
		it('should not fail', function() {
			const a = createHandler();
			const af1: Lazy<void> = a.handle; // adds possibility to use handle as Lazy<void>
			const af2: Endomorphism<void> = a.handle; // keeps possibility to use as Endomorphism<void>
			af1(); // no argument is needed
			af2(undefined); // still can pass undefined

			const b = createHandler<void>(); // the same as above
			const bf1: Lazy<void> = b.handle;
			const bf2: Endomorphism<void> = b.handle;
			bf1();
			bf2(undefined);

			const c = createHandler<string>();
			const cf3: (a: string) => void = c.handle; // that's correct
			cf3(''); // correct
		});
	});
});
