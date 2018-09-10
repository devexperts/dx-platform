import { Observable, Subject } from 'rxjs';
import { isNotNullable } from '@devexperts/utils/dist/object';
import { startWith } from 'rxjs/operators';

export type THandler<A> = {
	next: (value: A) => void;
	stream$: Observable<A>;
};
export const createHandler = <A>(startValue?: A): THandler<A> => {
	const stream = new Subject<A>();
	const next = (value: A) => stream.next(value);

	if (!isNotNullable(startValue)) {
		return {
			stream$: stream.asObservable(),
			next,
		};
	}
	return {
		stream$: stream.pipe(startWith(startValue)),
		next,
	};
};
