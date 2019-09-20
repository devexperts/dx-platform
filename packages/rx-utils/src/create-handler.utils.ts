import { Observable, Subject } from 'rxjs';

export type THandle<A> = A extends void ? ((a?: void) => void) : ((a: A) => void);
export type THandler<A> = {
	readonly value$: Observable<A>;
	readonly handle: THandle<A>;
};

export const createHandler = <A = void>(): THandler<A> => {
	const value = new Subject<A>();
	return {
		value$: value.asObservable(),
		handle: value.next.bind(value) as THandle<A>,
	};
};
