import { Observable, Subject } from 'rxjs';

export type THandler<A> = {
	handle: (value: A) => void;
	value$: Observable<A>;
};
export const createHandler = <A>(): THandler<A> => {
	const value = new Subject<A>();
	const handle = (val: A) => value.next(val);

	return {
		value$: value.asObservable(),
		handle,
	};
};
