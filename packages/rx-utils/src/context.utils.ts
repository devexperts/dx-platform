import { sequenceTSink, sink, Sink } from './sink.utils';
import { getReaderT } from 'fp-ts/lib/ReaderT';
import { Monad2 } from 'fp-ts/lib/Monad';
import { array } from 'fp-ts/lib/Array';
import { identity } from 'fp-ts/lib/function';
import { Reader } from 'fp-ts/lib/Reader';
import { sequenceT } from 'fp-ts/lib/Apply';
import {
	ProductLeft,
	productMapLeft,
} from '@devexperts/utils/dist/typeclasses/product-coproduct/product-coproduct.utils';
import { defer, MonadReader } from '@devexperts/utils/dist/typeclasses/monad-reader/monad-reader.utils';

export const URI = 'Context';
export type URI = 'Context';
declare module 'fp-ts/lib/HKT' {
	interface URI2HKT2<L, A> {
		Context: Context<L, A>;
	}
}

const readerTSink = getReaderT(sink);

export class Context<E, A> {
	readonly _URI!: URI;
	readonly _L!: E;
	readonly _A!: A;

	constructor(readonly run: (e: E) => Sink<A>) {}

	map<B>(f: (a: A) => B): Context<E, B> {
		return new Context(readerTSink.map(f, this.run));
	}

	ap<B>(fab: Context<E, (a: A) => B>): Context<E, B> {
		return new Context(readerTSink.ap(fab.run, this.run));
	}

	chain<B>(f: (a: A) => Context<E, B>): Context<E, B> {
		return new Context(readerTSink.chain(a => e => f(a).run(e), this.run));
	}
}

const of = <E, A>(a: A): Context<E, A> => new Context(readerTSink.of(a));
const map = <L, A, B>(fa: Context<L, A>, f: (a: A) => B): Context<L, B> => fa.map(f);

const ap = <E, A, B>(fab: Context<E, (a: A) => B>, fa: Context<E, A>): Context<E, B> => fa.ap(fab);
const chain = <E, A, B>(fa: Context<E, A>, f: (a: A) => Context<E, B>): Context<E, B> => fa.chain(f);

export const asks = <E, A>(f: (e: E) => A): Context<E, A> => new Context(e => new Sink(f(e)));
export const ask = <E>(): Context<E, E> => asks(identity);
const runReader = <E, A>(fa: Context<E, A>, e: E) => fa.run(e).value;
const productLeft = <EA, A, EB, B>(fa: Context<EA, A>, fb: Context<EB, B>): Context<EA & EB, [A, B]> =>
	new Context(e => sequenceTSink(fa.run(e), fb.run(e)));

export const context: Monad2<URI> & MonadReader<URI> & ProductLeft<URI> = {
	URI,
	of,
	map,
	ap,
	chain,
	asks,
	runReader,
	productLeft,
};

export const combineContext = productMapLeft(context as any);
export const deferContext = defer(context);
export const sequenceContext = array.sequence(context);
export const sequenceTContext = sequenceT(context);

export const fromReader = <E, A>(r: Reader<E, A>): Context<E, A> => new Context(e => new Sink(r.run(e)));

export type ContextEnvType<C extends Context<any, any>> = C extends Context<infer E, infer A> ? E : never;
export type ContextValueType<C extends Context<any, any>> = C extends Context<infer E, infer A> ? A : never;
