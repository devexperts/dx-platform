import { Observable, of, combineLatest } from 'rxjs';
import { remoteData, RemoteData, failure, isSuccess, success, toOption } from '@devexperts/remote-data-ts';
import { isSome, none, Option, some } from 'fp-ts/lib/Option';
import { MonadThrow2 } from 'fp-ts/lib/MonadThrow';
import {
	CoproductLeft,
	coproductMapLeft,
} from '@devexperts/utils/dist/typeclasses/product-left-coproduct-left/product-left-coproduct-left.utils';
import { getApplicativeComposition } from 'fp-ts/lib/Applicative';
import { instanceObservable } from './observable.utils';
import { pipeable } from 'fp-ts/lib/pipeable';
import { sequenceT } from 'fp-ts/lib/Apply';
import { array } from 'fp-ts/lib/Array';
import { Filterable2 } from 'fp-ts/lib/Filterable';
import { identity, not, Predicate } from 'fp-ts/lib/function';
import { Separated } from 'fp-ts/lib/Compactable';
import { isLeft, isRight } from 'fp-ts/lib/Either';

export interface LiveData<E, A> extends Observable<RemoteData<E, A>> {}

export const URI = '@devexperts/dx-utils//LiveData';
export type URI = typeof URI;
declare module 'fp-ts/lib/HKT' {
	interface URItoKind2<E, A> {
		[URI]: LiveData<E, A>;
	}
}

const tupleC = <A>(a: A) => <B>(b: B): [A, B] => [a, b];
const combineRD = <EA, A, EB, B>(fa: RemoteData<EA, A>, fb: RemoteData<EB, B>): RemoteData<EA | EB, [A, B]> =>
	remoteData.ap<EA | EB, B, [A, B]>(remoteData.map(fa, tupleC), fb);

export const instanceLiveData: MonadThrow2<URI> & CoproductLeft<URI> & Filterable2<URI> = {
	URI,
	...getApplicativeComposition(instanceObservable, remoteData),
	chain: (fa, f) => instanceObservable.chain(fa, a => (isSuccess(a) ? f(a.value) : of(a))),
	throwError: e => of(failure(e)),
	coproductLeft: <EA, A, EB, B>(fa: LiveData<EA, A>, fb: LiveData<EB, B>) =>
		instanceObservable.map(combineLatest(fa, fb), ([a, b]) => combineRD(a, b)),
	filter: <E, A>(fa: LiveData<E, A>, p: Predicate<A>): LiveData<E, A> =>
		new Observable(subscriber =>
			fa.subscribe(a => {
				if (!isSuccess(a) || p(a.value)) {
					subscriber.next(a);
				}
			}),
		),
	filterMap: (fa, f) =>
		new Observable(subscriber =>
			fa.subscribe(a => {
				if (!isSuccess(a)) {
					subscriber.next(a);
				} else {
					const b = f(a.value);
					if (isSome(b)) {
						subscriber.next(success(b.value));
					}
				}
			}),
		),
	compact: fa => instanceLiveData.filterMap(fa, identity),
	partition: <E, A>(fa: LiveData<E, A>, p: Predicate<A>): Separated<LiveData<E, A>, LiveData<E, A>> => ({
		left: instanceLiveData.filter(fa, not(p)),
		right: instanceLiveData.filter(fa, p),
	}),
	partitionMap: (fa, f) => ({
		left: instanceLiveData.filterMap(fa, a => {
			const eb = f(a);
			return isLeft(eb) ? some(eb.left) : none;
		}),
		right: instanceLiveData.filterMap(fa, a => {
			const eb = f(a);
			return isRight(eb) ? some(eb.right) : none;
		}),
	}),
	separate: fa => instanceLiveData.partitionMap(fa, identity),
};

export const liveData = {
	...instanceLiveData,
	...pipeable(instanceLiveData),
	sequenceT: sequenceT(instanceLiveData),
	sequenceArray: array.sequence(instanceLiveData),
	combine: coproductMapLeft(instanceLiveData),
};

export interface LiveDataOption<E, A> extends Observable<RemoteData<E, Option<A>>> {}
