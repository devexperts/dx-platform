import { Observable, of, combineLatest } from 'rxjs';
import { remoteData, RemoteData, fold as foldRD, failure } from '@devexperts/remote-data-ts';
import { Option } from 'fp-ts/lib/Option';
import { MonadThrow2 } from 'fp-ts/lib/MonadThrow';
import {
	CoproductLeft,
	coproductMapLeft,
} from '@devexperts/utils/src/typeclasses/product-left-coproduct-left/product-left-coproduct-left.utils';
import { getApplicativeComposition } from 'fp-ts/lib/Applicative';
import { instanceObservable, observable } from './observable.utils';
import { pipeable } from 'fp-ts/lib/pipeable';
import { sequenceT } from 'fp-ts/lib/Apply';
import { array } from 'fp-ts/lib/Array';

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

export const instanceLiveData: MonadThrow2<URI> & CoproductLeft<URI> = {
	URI,
	...getApplicativeComposition(instanceObservable, remoteData),
	chain: (fa, f) => instanceObservable.chain(fa, foldRD(observable.zero, observable.zero, observable.zero, f)),
	throwError: e => of(failure(e)),
	coproductLeft: <EA, A, EB, B>(fa: LiveData<EA, A>, fb: LiveData<EB, B>) =>
		instanceObservable.map(combineLatest(fa, fb), ([a, b]) => combineRD(a, b)),
};

export const liveData = {
	...instanceLiveData,
	...pipeable(instanceLiveData),
	sequenceT: sequenceT(instanceLiveData),
	sequenceArray: array.sequence(instanceLiveData),
	combine: coproductMapLeft(instanceLiveData),
};

export interface LiveDataOption<E, A> extends Observable<RemoteData<E, Option<A>>> {}
