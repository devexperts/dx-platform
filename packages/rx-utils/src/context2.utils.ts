import { getReaderM, ReaderM1 } from 'fp-ts/lib/ReaderT';
import { Monad2 } from 'fp-ts/lib/Monad';
import { map as readerMap, Reader } from 'fp-ts/lib/Reader';
import { sequenceT } from 'fp-ts/lib/Apply';
import { Omit } from 'typelevel-ts';
import {
	ProductLeft,
	ProductMap,
	ProjectMany,
} from '@devexperts/utils/dist/typeclasses/product-left-coproduct-left/product-left-coproduct-left.utils';
import { deferReader } from '@devexperts/utils/dist/adt/reader.utils';
import { pipe, pipeable } from 'fp-ts/lib/pipeable';
import { memoOnce } from '@devexperts/utils/dist/function/memoize';
import { NonEmptyArray } from 'fp-ts/lib/NonEmptyArray';
import { array } from 'fp-ts/lib/Array';
import { instanceSink, sink, Sink, URI as URISink } from './sink2.utils';
import { strictEqual } from 'fp-ts/lib/Eq';

export const URI = '@devexperts/dx-utils//Context';
export type URI = typeof URI;
declare module 'fp-ts/lib/HKT' {
	interface URItoKind2<E, A> {
		[URI]: Context<E, A>;
	}
}

export interface Context<E, A> extends Reader<E, Sink<A>> {}

const memo = memoOnce({
	equals: strictEqual,
});
export const instanceContext: Monad2<URI> & ProductLeft<URI> = {
	URI,
	...getReaderM(instanceSink),
	productLeft: (fa, fb) => e => sink.sequenceT(fa(e), fb(e)),
};

const sequenceT_ = sequenceT(instanceContext);
const sequenceArray = array.sequence(instanceContext);

const defer = <E extends object, A, K extends keyof E>(
	fa: Context<E, A>,
	...keys: K[]
): Context<Omit<E, K>, Context<Pick<E, K>, A>> => pipe(deferReader(fa, ...keys), readerMap(instanceSink.of));

const combine: ProductMap<URI> = <E, A, R>(...args: NonEmptyArray<Context<E, A> | ProjectMany<A, R>>) => {
	const last = args.length - 1;
	const fas = sequenceArray(args.slice(0, last) as Context<E, A>[]); // guaranteed by ProductMap
	const project = memo(args[last] as ProjectMany<A, R>); // guaranteed by ProductMap
	return instanceContext.map(fas, as => project(...as));
};

const key = <A>() => <K extends PropertyKey>(key: K): Context<Record<K, A>, A> => e => sink.of(e[key]);

export const context = {
	...instanceContext,
	...pipeable(instanceContext),
	sequenceT: sequenceT_,
	sequenceArray,
	combine,
	defer,
	key,
};
