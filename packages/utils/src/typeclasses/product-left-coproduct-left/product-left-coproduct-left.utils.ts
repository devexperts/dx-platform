import { Type2, URIS2 } from 'fp-ts/lib/HKT';
import { Apply2, sequenceT } from 'fp-ts/lib/Apply';

export type ProjectMany<A, R> = (...args: A[]) => R;

export interface ProductMap<F extends URIS2> {
	<E, A, R>(a: Type2<F, E, A>, project: (a: A) => R): Type2<F, E, R>;
	<EA, A, EB, B, R>(a: Type2<F, EA, A>, b: Type2<F, EB, B>, project: (a: A, b: B) => R): Type2<F, EA & EB, R>;
	<EA, A, EB, B, EC, C, R>(
		a: Type2<F, EA, A>,
		b: Type2<F, EB, B>,
		C: Type2<F, EC, C>,
		project: (a: A, b: B, c: C) => R,
	): Type2<F, EA & EB & EC, R>;
	<EA, A, EB, B, EC, C, ED, D, R>(
		a: Type2<F, EA, A>,
		b: Type2<F, EB, B>,
		c: Type2<F, EC, C>,
		d: Type2<F, ED, D>,
		project: (a: A, b: B, c: C, d: D) => R,
	): Type2<F, EA & EB & EC & ED, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, R>(
		a: Type2<F, EA, A>,
		b: Type2<F, EB, B>,
		c: Type2<F, EC, C>,
		d: Type2<F, ED, D>,
		e: Type2<F, EE, E>,
		project: (a: A, b: B, c: C, d: D, e: E) => R,
	): Type2<F, EA & EB & EC & ED & EE, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, R>(
		a: Type2<F, EA, A>,
		b: Type2<F, EB, B>,
		c: Type2<F, EC, C>,
		d: Type2<F, ED, D>,
		e: Type2<F, EE, E>,
		project: (a: A, b: B, c: C, d: D, e: E) => R,
	): Type2<F, EA & EB & EC & ED & EE, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, EG, G, R>(
		a: Type2<F, EA, A>,
		b: Type2<F, EB, B>,
		c: Type2<F, EC, C>,
		d: Type2<F, ED, D>,
		e: Type2<F, EE, E>,
		g: Type2<F, EG, G>,
		project: (a: A, b: B, c: C, d: D, e: E, g: G) => R,
	): Type2<F, EA & EB & EC & ED & EE & EG, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, EG, G, EH, H, R>(
		a: Type2<F, EA, A>,
		b: Type2<F, EB, B>,
		c: Type2<F, EC, C>,
		d: Type2<F, ED, D>,
		e: Type2<F, EE, E>,
		g: Type2<F, EG, G>,
		h: Type2<F, EH, H>,
		project: (a: A, b: B, c: C, d: D, e: E, g: G, h: H) => R,
	): Type2<F, EA & EB & EC & ED & EE & EG & EH, R>;
}

export interface CoproductMap<F extends URIS2> {
	<E, A, R>(a: Type2<F, E, A>, project: (a: A) => R): Type2<F, E, R>;
	<EA, A, EB, B, R>(a: Type2<F, EA, A>, b: Type2<F, EB, B>, project: (a: A, b: B) => R): Type2<F, EA | EB, R>;
	<EA, A, EB, B, EC, C, R>(
		a: Type2<F, EA, A>,
		b: Type2<F, EB, B>,
		C: Type2<F, EC, C>,
		project: (a: A, b: B, c: C) => R,
	): Type2<F, EA | EB | EC, R>;
	<EA, A, EB, B, EC, C, ED, D, R>(
		a: Type2<F, EA, A>,
		b: Type2<F, EB, B>,
		c: Type2<F, EC, C>,
		d: Type2<F, ED, D>,
		project: (a: A, b: B, c: C, d: D) => R,
	): Type2<F, EA | EB | EC | ED, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, R>(
		a: Type2<F, EA, A>,
		b: Type2<F, EB, B>,
		c: Type2<F, EC, C>,
		d: Type2<F, ED, D>,
		e: Type2<F, EE, E>,
		project: (a: A, b: B, c: C, d: D, e: E) => R,
	): Type2<F, EA | EB | EC | ED | EE, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, R>(
		a: Type2<F, EA, A>,
		b: Type2<F, EB, B>,
		c: Type2<F, EC, C>,
		d: Type2<F, ED, D>,
		e: Type2<F, EE, E>,
		project: (a: A, b: B, c: C, d: D, e: E) => R,
	): Type2<F, EA | EB | EC | ED | EE, R>;
	<EA, A, EB, B, EC, C, ED, D, EE, E, EG, G, R>(
		a: Type2<F, EA, A>,
		b: Type2<F, EB, B>,
		c: Type2<F, EC, C>,
		d: Type2<F, ED, D>,
		e: Type2<F, EE, E>,
		g: Type2<F, EG, G>,
		project: (a: A, b: B, c: C, d: D, e: E, g: G) => R,
	): Type2<F, EA | EB | EC | ED | EE | EG, R>;
}

const internal = <F extends URIS2>(F: Apply2<F>) => {
	const sequenceTF = sequenceT(F);
	return <E, A, R>(...args: Array<A | ProjectMany<A, R>>) => {
		const fas: Type2<F, E, A>[] = args.slice(0, args.length - 1) as any;
		const project: ProjectMany<A, R> = args[args.length - 1] as any;
		const sequenced: Type2<F, E, A[]> = sequenceTF.apply(null, fas as any) as any;
		return F.map(sequenced, as => project(...as));
	};
};

/**
 * @typeclass
 * Describes data types of kind `*->*->*` which can be combined in a tuple
 * with a `product` (`&`) of their left-side types on the left side of such tuple
 */
export interface ProductLeft<F extends URIS2> extends Apply2<F> {
	readonly productLeft: <EA, A, EB, B>(fa: Type2<F, EA, A>, fb: Type2<F, EB, B>) => Type2<F, EA & EB, [A, B]>;
}

/**
 * @typeclass
 * Describes data types of kind `*->*->*` which can be combined in a tuple
 * with a `coproduct` (`|`) of their left-side types on the left side of such tuple
 */
export interface CoproductLeft<F extends URIS2> extends Apply2<F> {
	readonly coproductLeft: <EA, A, EB, B>(fa: Type2<F, EA, A>, fb: Type2<F, EB, B>) => Type2<F, EA | EB, [A, B]>;
}

/**
 * Sequences multiple {@link ProductLeft}s of kind `*->*->*`
 * applicatively accumulating their values and then applying `project` function to those values
 * and wrapping its result in the same {@link ProductLeft} with a `product` (`&`) of types of _left_ side
 */
export const productMapLeft = <F extends URIS2>(F: ProductLeft<F>): ProductMap<F> => internal(F);

/**
 * Sequences multiple {@link CoproductLeft}s of kind `*->*->*`
 * applicatively accumulating their values and then applying `project` function to those values
 * and wrapping its result in the same {@link CoproductLeft} with a `coproduct` (`|`) of types of _left_ side
 */
export const coproductMapLeft = <F extends URIS2>(F: CoproductLeft<F>): CoproductMap<F> => internal(F);
