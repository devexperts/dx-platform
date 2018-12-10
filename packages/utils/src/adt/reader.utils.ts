import { Reader, asks, reader as fptsreader, URI } from 'fp-ts/lib/Reader';
import { sequenceT } from 'fp-ts/lib/Apply';
import { tuple } from 'fp-ts/lib/function';
import { ProductLeft, productMapLeft } from '../typeclasses/product-coproduct/product-coproduct.utils';
import { defer, MonadReader } from '../typeclasses/monad-reader/monad-reader.utils';

const productLeft = <EA, A, EB, B>(fa: Reader<EA, A>, fb: Reader<EB, B>): Reader<EA & EB, [A, B]> =>
	asks(e => tuple(fa.run(e), fb.run(e)));

const runReader = <E, A>(fa: Reader<E, A>, e: E): A => fa.run(e);

export const reader: typeof fptsreader & ProductLeft<URI> & MonadReader<URI> = {
	...fptsreader,
	asks,
	runReader,
	productLeft,
};

export const sequenceTReader = sequenceT(reader);
export const combineReader = productMapLeft(reader);
export const deferReader = defer(reader);

export type ReaderEnvType<F extends Reader<any, any>> = F extends Reader<infer E, infer A> ? E : never;
export type ReaderValueType<F extends Reader<any, any>> = F extends Reader<infer E, infer A> ? A : never;
