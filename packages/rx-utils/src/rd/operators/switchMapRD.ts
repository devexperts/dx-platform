import { Observable, of, OperatorFunction } from 'rxjs';
import { isSuccess, RemoteData } from '@devexperts/remote-data-ts';
import { switchMap } from 'rxjs/operators';

export const switchMapRD = <L, A, B>(
	f: (a: A) => Observable<RemoteData<L, B>>,
): OperatorFunction<RemoteData<L, A>, RemoteData<L, B>> =>
	switchMap(data => (isSuccess(data) ? f(data.value) : of(data)));
