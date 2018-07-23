import { Function1 } from 'fp-ts/lib/function';
import { Observable, of } from 'rxjs';
import { RemoteData } from '@devexperts/remote-data-ts';
import { switchMap } from 'rxjs/operators';

export function switchMapRD<L, A, B>(f: Function1<A, Observable<RemoteData<L, B>>>) {
	return function switchMapRDOperatorFunction(source: Observable<RemoteData<L, A>>): Observable<RemoteData<L, B>> {
		return switchMap((data: RemoteData<L, A>) => {
			if (data.isSuccess()) {
				return f(data.value);
			} else {
				return of(source);
			}
		})(source);
	};
}
