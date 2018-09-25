import { Observable, Subject } from 'rxjs';

export type THandler<A> = {
	readonly handle: A extends void ? () => void : (value: A) => void;
	readonly value$: Observable<A>;
};

export const createHandler = <A = void>(): THandler<A> => {
	const value = new Subject<A>();
	const handle = (val: A) => value.next(val);

	return {
		value$: value.asObservable(),
		handle,
	} as any;
};
