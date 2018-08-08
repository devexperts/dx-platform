import { Reader, asks } from 'fp-ts/lib/Reader';

export type ProjectMany<E, A, R> = (...args: Array<A[] | E>) => R;

export function combine<E extends object, A, R>(a: Reader<E, A>, project: (a: A, e: E) => R): Reader<E, R>;
export function combine<EA extends object, A, EB extends object, B, R>(
	a: Reader<EA, A>,
	b: Reader<EB, B>,
	project: (a: A, b: B, e: EA & EB) => R,
): Reader<EA & EB, R>;
export function combine<EA extends object, A, EB extends object, B, EC extends object, C, R>(
	a: Reader<EA, A>,
	b: Reader<EB, B>,
	c: Reader<EC, C>,
	project: (a: A, b: B, c: C, e: EA & EB & EC) => R,
): Reader<EA & EB & EC, R>;
export function combine<EA extends object, A, EB extends object, B, EC extends object, C, ED extends object, D, R>(
	a: Reader<EA, A>,
	b: Reader<EB, B>,
	c: Reader<EC, C>,
	d: Reader<ED, D>,
	project: (a: A, b: B, c: C, d: D, e: EA & EB & EC & ED) => R,
): Reader<EA & EB & EC & ED, R>;
export function combine<
	EA extends object,
	A,
	EB extends object,
	B,
	EC extends object,
	C,
	ED extends object,
	D,
	EF extends object,
	F,
	R
>(
	a: Reader<EA, A>,
	b: Reader<EB, B>,
	c: Reader<EC, C>,
	d: Reader<ED, D>,
	f: Reader<EF, F>,
	project: (a: A, b: B, c: C, d: D, f: F, e: EA & EB & EC & ED & EF) => R,
): Reader<EA & EB & EC & ED & EF, R>;
export function combine<
	EA extends object,
	A,
	EB extends object,
	B,
	EC extends object,
	C,
	ED extends object,
	D,
	EF extends object,
	F,
	EG extends object,
	G,
	R
>(
	a: Reader<EA, A>,
	b: Reader<EB, B>,
	c: Reader<EC, C>,
	d: Reader<ED, D>,
	f: Reader<EF, F>,
	g: Reader<EG, G>,
	project: (a: A, b: B, c: C, d: D, f: F, g: G, e: EA & EB & EC & ED & EF & EG) => R,
): Reader<EA & EB & EC & ED & EF & EG, R>;
export function combine<E, A, R>(...args: Array<Reader<E, A> | ProjectMany<E, A, R>>): Reader<E, R> {
	// ts makes sure args has at least two elements
	const readers: Reader<E, A>[] = args.slice(0, args.length - 1) as any; //typesafe
	const project: ProjectMany<E, A, R> = args[args.length - 1] as any; //typesafe
	return asks((e: E) => project(...(readers.map(r => r.run(e)) as any), e));
}
