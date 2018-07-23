import { Function1 } from 'fp-ts/lib/function';
import { Observable } from 'rxjs';
import { RemoteData } from '@devexperts/remote-data-ts';
import { map } from 'rxjs/operators';

export function mapRD<L, A, B>(f: Function1<A, B>) {
	return function mapRDOperatorFunction(source: Observable<RemoteData<L, A>>): Observable<RemoteData<L, B>> {
		return map((data: RemoteData<L, A>) => data.map(f))(source);
	};
}
