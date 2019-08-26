import { MonoTypeOperatorFunction } from 'rxjs';
import { isSuccess, RemoteData } from '@devexperts/remote-data-ts';
import { tap } from 'rxjs/operators';

export const tapRD = <L, A>(f: (a: A) => void): MonoTypeOperatorFunction<RemoteData<L, A>> =>
	tap(data => isSuccess(data) && f(data.value));
