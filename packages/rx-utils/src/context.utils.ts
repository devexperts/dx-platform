import { sink, Sink } from './sink.utils';
import { getReaderT } from 'fp-ts/lib/ReaderT';
import { Monad2 } from 'fp-ts/lib/Monad';
import { array } from 'fp-ts/lib/Array';
import { identity } from 'fp-ts/lib/function';
import { Reader } from 'fp-ts/lib/Reader';
import { sequenceT } from 'fp-ts/lib/Apply';
import { Omit } from 'typelevel-ts';

export const URI = 'Context';
export type URI = typeof URI;
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

export const context: Monad2<URI> = {
	URI,
	of,
	map,
	ap,
	chain,
};

export const deferContext = <E extends object, A, K extends keyof E>(
	fa: Context<E, A>,
	...keys: K[]
): Context<Omit<E, K>, Context<Pick<E, K>, A>> =>
	new Context(outerE => new Sink(new Context(innerE => fa.run(Object.assign({}, outerE, innerE) as E))));
export const sequenceContext = array.sequence(context);
export const sequenceTContext = sequenceT(context);

export const fromReader = <E, A>(r: Reader<E, A>): Context<E, A> => new Context(e => new Sink(r.run(e)));

export type ContextEnvType<C extends Context<any, any>> = C extends Context<infer E, infer A> ? E : never;
export type ContextValueType<C extends Context<any, any>> = C extends Context<infer E, infer A> ? A : never;

export interface CombineContext {
	<E, A, R>(a: Context<E, A>): (project: (a: A) => R | Sink<R>) => Context<E, R>;
	<EA, A, EB, B, R>(a: Context<EA, A>, b: Context<EB, B>): (
		project: (a: A, b: B) => R | Sink<R>,
	) => Context<EA & EB, R>;
	<EA, A, EB, B, EC, C, R>(a: Context<EA, A>, b: Context<EB, B>, C: Context<EC, C>): (
		project: (a: A, b: B, c: C) => R | Sink<R>,
	) => Context<EA & EB & EC, R>;
	<EA, A, EB, B, EC, C, ED, D, R>(a: Context<EA, A>, b: Context<EB, B>, c: Context<EC, C>, d: Context<ED, D>): (
		project: (a: A, b: B, c: C, d: D) => R | Sink<R>,
	) => Context<EA & EB & EC & ED, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, R>(
		a: Context<EA, A>,
		b: Context<EB, B>,
		c: Context<EC, C>,
		d: Context<ED, D>,
		e: Context<EE, E>,
	): (project: (a: A, b: B, c: C, d: D, e: E) => R | Sink<R>) => Context<EA & EB & EC & ED & EE, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, R>(
		a: Context<EA, A>,
		b: Context<EB, B>,
		c: Context<EC, C>,
		d: Context<ED, D>,
		e: Context<EE, E>,
	): (project: (a: A, b: B, c: C, d: D, e: E) => R | Sink<R>) => Context<EA & EB & EC & ED & EE, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, EG, G, R>(
		a: Context<EA, A>,
		b: Context<EB, B>,
		c: Context<EC, C>,
		d: Context<ED, D>,
		e: Context<EE, E>,
		g: Context<EG, G>,
	): (project: (a: A, b: B, c: C, d: D, e: E, g: G) => R | Sink<R>) => Context<EA & EB & EC & ED & EE & EG, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, EG, G, EH, H, R>(
		a: Context<EA, A>,
		b: Context<EB, B>,
		c: Context<EC, C>,
		d: Context<ED, D>,
		e: Context<EE, E>,
		g: Context<EG, G>,
		h: Context<EH, H>,
	): (
		project: (a: A, b: B, c: C, d: D, e: E, g: G, h: H) => R | Sink<R>,
	) => Context<EA & EB & EC & ED & EE & EG & EH, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, EG, G, EH, H, EI, I, R>(
		a: Context<EA, A>,
		b: Context<EB, B>,
		c: Context<EC, C>,
		d: Context<ED, D>,
		e: Context<EE, E>,
		g: Context<EG, G>,
		h: Context<EH, H>,
		i: Context<EI, I>,
	): (
		project: (a: A, b: B, c: C, d: D, e: E, g: G, h: H, i: I) => R | Sink<R>,
	) => Context<EA & EB & EC & ED & EE & EG & EH & EI, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, EG, G, EH, H, EI, I, EJ, J, R>(
		a: Context<EA, A>,
		b: Context<EB, B>,
		c: Context<EC, C>,
		d: Context<ED, D>,
		e: Context<EE, E>,
		g: Context<EG, G>,
		h: Context<EH, H>,
		i: Context<EI, I>,
		j: Context<EJ, J>,
	): (
		project: (a: A, b: B, c: C, d: D, e: E, g: G, h: H, i: I, j: J) => R | Sink<R>,
	) => Context<EA & EB & EC & ED & EE & EG & EH & EI & EJ, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, EG, G, EH, H, EI, I, EJ, J, EK, K, R>(
		a: Context<EA, A>,
		b: Context<EB, B>,
		c: Context<EC, C>,
		d: Context<ED, D>,
		e: Context<EE, E>,
		g: Context<EG, G>,
		h: Context<EH, H>,
		i: Context<EI, I>,
		j: Context<EJ, J>,
		k: Context<EK, K>,
	): (
		project: (a: A, b: B, c: C, d: D, e: E, g: G, h: H, i: I, j: J, k: K) => R | Sink<R>,
	) => Context<EA & EB & EC & ED & EE & EG & EH & EI & EJ & EK, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, EG, G, EH, H, EI, I, EJ, J, EK, K, EL, L, R>(
		a: Context<EA, A>,
		b: Context<EB, B>,
		c: Context<EC, C>,
		d: Context<ED, D>,
		e: Context<EE, E>,
		g: Context<EG, G>,
		h: Context<EH, H>,
		i: Context<EI, I>,
		j: Context<EJ, J>,
		k: Context<EK, K>,
		l: Context<EL, L>,
	): (
		project: (a: A, b: B, c: C, d: D, e: E, g: G, h: H, i: I, j: J, k: K, l: L) => R | Sink<R>,
	) => Context<EA & EB & EC & ED & EE & EG & EH & EI & EJ & EK & EL, R>;
}

export const combineContext: CombineContext = <E, A, R>(...fas: Array<Context<E, A>>) => (
	project: (...args: A[]) => R | Sink<R>,
) => {
	const sequenced: Context<E, A[]> = sequenceContext(fas);
	return sequenced.chain(
		as =>
			new Context(() => {
				const result = project(...as);
				return result instanceof Sink ? result : new Sink(result);
			}),
	);
};
