import { Observable, Operator, OperatorFunction, Subscriber } from 'rxjs';
import { Option } from 'fp-ts/lib/Option';

class FilterMapSubscriber<T, R> extends Subscriber<T> {
	count: number = 0;

	constructor(
		destination: Subscriber<R>,
		private filterMap: (value: T, index: number) => Option<R>,
		private thisArg: any,
	) {
		super(destination);
	}

	protected _next = (value: T) => {
		let result: Option<R> | undefined = undefined;
		try {
			result = this.filterMap.call(this.thisArg, value, this.count++);
		} catch (e) {
			this.destination.error && this.destination.error(e);
			return;
		}

		if (result && result.isSome()) {
			this.destination.next && this.destination.next(result.value);
		}
	};
}

class FilterMapOperator<T, R> implements Operator<T, R> {
	constructor(private filterMap: (value: T, index: number) => Option<R>, private thisArg: any) {}

	call(subscriber: Subscriber<R>, source: any): any {
		return source.subscribe(new FilterMapSubscriber(subscriber, this.filterMap, this.thisArg));
	}
}

export function filterMap<T, R>(
	filterMap: (value: T, index: number) => Option<R>,
	thisArg?: any,
): OperatorFunction<T, R> {
	return function mapOperation(source: Observable<T>): Observable<R> {
		return source.lift(new FilterMapOperator(filterMap, thisArg));
	};
}
