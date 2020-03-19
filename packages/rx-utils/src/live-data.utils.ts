import { Observable } from 'rxjs';
import { remoteData, RemoteData, failure, isSuccess } from '@devexperts/remote-data-ts';
import { Option } from 'fp-ts/lib/Option';
import { MonadThrow2 } from 'fp-ts/lib/MonadThrow';
import {
	CoproductLeft,
	coproductMapLeft,
} from '@devexperts/utils/dist/typeclasses/product-left-coproduct-left/product-left-coproduct-left.utils';
import { instanceObservable } from './observable.utils';
import { pipeable } from 'fp-ts/lib/pipeable';
import { sequenceT } from 'fp-ts/lib/Apply';
import { array } from 'fp-ts/lib/Array';
import { Filterable2 } from 'fp-ts/lib/Filterable';
import { getLiveDataM } from '@devexperts/utils/dist/adt/live-data.utils';
import { FoldableValue2 } from '@devexperts/utils/dist/typeclasses/foldable-value/foldable-value';

/**
 * isomoprhic to `LiveData12<typeof instanceObservable.URI, typeof remoteData.URI, E, A>`
 * but left as an interface to not overload typechecker and IDE
 *
 * @deprecated Compose `LiveData` in the end project
 */
export interface LiveData<E, A> extends Observable<RemoteData<E, A>> {}

/**
 * @deprecated Compose `LiveData` in the end project
 */
export const URI = '@devexperts/rx-utils//LiveData';
/**
 * @deprecated Compose `LiveData` in the end project
 */
export type URI = typeof URI;
declare module 'fp-ts/lib/HKT' {
	interface URItoKind2<E, A> {
		[URI]: LiveData<E, A>;
	}
}

const foldableValueRemoteData: FoldableValue2<typeof remoteData.URI> & MonadThrow2<typeof remoteData.URI> = {
	...remoteData,
	foldValue: (fa, onNever, onValue) => (isSuccess(fa) ? onValue(fa.value) : onNever(fa)),
	throwError: failure,
};

/**
 * @deprecated Compose `instanceLiveData` in the end project
 */
const instanceLiveData: MonadThrow2<URI> & CoproductLeft<URI> & Filterable2<URI> = {
	URI,
	...getLiveDataM(instanceObservable, foldableValueRemoteData),
};

/**
 * @deprecated Compose `liveData` in the end project
 */
export const liveData = {
	...instanceLiveData,
	...pipeable(instanceLiveData),
	sequenceT: sequenceT(instanceLiveData),
	sequenceArray: array.sequence(instanceLiveData),
	combine: coproductMapLeft(instanceLiveData),
};

/**
 * @deprecated Compose `LiveDataOption` in the end project
 */
export interface LiveDataOption<E, A> extends Observable<RemoteData<E, Option<A>>> {}
