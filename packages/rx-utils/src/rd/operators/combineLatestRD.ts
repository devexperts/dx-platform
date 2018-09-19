import { combineLatest, Observable } from 'rxjs';
import { combine, RemoteData } from '@devexperts/remote-data-ts';

export function combineLatestRD<L, A, B>(
	a: Observable<RemoteData<L, A>>,
	b: Observable<RemoteData<L, B>>,
): Observable<RemoteData<L, [A, B]>>;
export function combineLatestRD<L, A, B, C>(
	a: Observable<RemoteData<L, A>>,
	b: Observable<RemoteData<L, B>>,
	c: Observable<RemoteData<L, C>>,
): Observable<RemoteData<L, [A, B, C]>>;
export function combineLatestRD<L, A, B, C, D>(
	a: Observable<RemoteData<L, A>>,
	b: Observable<RemoteData<L, B>>,
	c: Observable<RemoteData<L, C>>,
	d: Observable<RemoteData<L, D>>,
): Observable<RemoteData<L, [A, B, C, D]>>;
export function combineLatestRD<L, A, B, C, D, E>(
	a: Observable<RemoteData<L, A>>,
	b: Observable<RemoteData<L, B>>,
	c: Observable<RemoteData<L, C>>,
	d: Observable<RemoteData<L, D>>,
	e: Observable<RemoteData<L, E>>,
): Observable<RemoteData<L, [A, B, C, D, E]>>;
export function combineLatestRD<L, A, B, C, D, E, F>(
	a: Observable<RemoteData<L, A>>,
	b: Observable<RemoteData<L, B>>,
	c: Observable<RemoteData<L, C>>,
	d: Observable<RemoteData<L, D>>,
	e: Observable<RemoteData<L, E>>,
	f: Observable<RemoteData<L, F>>,
): Observable<RemoteData<L, [A, B, C, D, E, F]>>;
export function combineLatestRD<L, A>(...as: Observable<RemoteData<L, A>>[]): Observable<RemoteData<L, A[]>> {
	return combineLatest<RemoteData<L, A[]>>(...as, combine);
}
