import { Observable } from 'rxjs';
import { RemoteData } from '@devexperts/remote-data-ts';
import { tap } from 'rxjs/operators';
import { Function1 } from 'fp-ts/lib/function';

export function tapRD<L, A>(f: Function1<A, void>) {
	return function tapRDOperatorFunction(source: Observable<RemoteData<L, A>>): Observable<RemoteData<L, A>> {
		return tap((data: RemoteData<L, A>) => {
			if (data.isSuccess()) {
				f(data.value);
			}
		})(source);
	};
}
