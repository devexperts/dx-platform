import { Observable, Subject } from 'rxjs';

interface HandlerVoid {
	readonly value$: Observable<void>;
	readonly handle: () => void;
}
interface HandlerValue<A> {
	readonly value$: Observable<A>;
	readonly handle: (a: A) => void;
}
interface CreateHandler {
	(): HandlerVoid;
	<A extends void>(): HandlerVoid;
	<A>(): HandlerValue<A>;
}

/**
 * @deprecated Use `MonadObservable#createAdapter` from `@devexperts/utils`
 */
export const createHandler: CreateHandler = <A>() => {
	const value = new Subject<A>();
	return {
		value$: value.asObservable(),
		handle: value.next.bind(value),
	};
};
