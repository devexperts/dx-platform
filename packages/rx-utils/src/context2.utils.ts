import { getReaderM, ReaderM1 } from 'fp-ts/lib/ReaderT';
import { Monad2 } from 'fp-ts/lib/Monad';
import { map as readerMap, Reader } from 'fp-ts/lib/Reader';
import { sequenceT } from 'fp-ts/lib/Apply';
import { Omit } from 'typelevel-ts';
import { combineLatest, Observable } from 'rxjs';
import {
	ProductLeft,
	ProductMap,
	ProjectMany,
} from '@devexperts/utils/src/typeclasses/product-left-coproduct-left/product-left-coproduct-left.utils';
import { deferReader } from '@devexperts/utils/src/adt/reader.utils';
import { pipe, pipeable } from 'fp-ts/lib/pipeable';
import { memoOnce } from '@devexperts/utils/src/function/memoize';
import { eqShallow } from '@devexperts/utils/src/typeclasses/eq/eq.utils';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { array } from 'fp-ts/lib/Array';
import { URI as URIObservable } from 'fp-ts-rxjs/lib/Observable';
import { observable } from './observable.utils';

export const URI = '@devexperts/dx-utils//Context';
export type URI = typeof URI;
declare module 'fp-ts/lib/HKT' {
	interface URItoKind2<E, A> {
		[URI]: Context<E, A>;
	}
}

export interface Context<E, A> extends Reader<E, Observable<A>> {}

const memo = memoOnce(eqShallow);
export const contextInstance: Monad2<URI> & ProductLeft<URI> & ReaderM1<URIObservable> = {
	URI,
	...getReaderM(observable),
	asks: f => memo(e => observable.of(f(e))),
	productLeft: (fa, fb) => e => combineLatest(fa(e), fb(e)),
};

const sequenceT_ = sequenceT(contextInstance);
const sequenceArray = array.sequence(contextInstance);

const defer = <E extends object, A, K extends keyof E>(
	fa: Context<E, A>,
	...keys: K[]
): Context<Omit<E, K>, Context<Pick<E, K>, A>> => pipe(deferReader(fa, ...keys), readerMap(observable.of));

const combine: ProductMap<URI> = <E, A, R>(...args: NonEmptyArray<Context<E, A> | ProjectMany<A, R>>) => {
	const last = args.length - 1;
	const fas = sequenceArray(args.slice(0, last) as Context<E, A>[]); // guaranteed by ProductMap
	const project = memo(args[last] as ProjectMany<A, R>); // guaranteed by ProductMap
	return contextInstance.map(fas, as => project(...as));
};

export const context = {
	...contextInstance,
	...pipeable(contextInstance),
	sequenceT: sequenceT_,
	sequenceArray,
	combine,
	defer,
};
