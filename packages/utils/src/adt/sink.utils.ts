import { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/lib/HKT';
import { Alternative, Alternative1, Alternative2 } from 'fp-ts/lib/Alternative';

export interface Sink<M, A> {
	readonly value: A;
	readonly effects: HKT<M, unknown>;
}

export interface SinkM<M> {
	readonly map: <A, B>(fa: Sink<M, A>, f: (a: A) => B) => Sink<M, B>;
	readonly of: <A>(a: A) => Sink<M, A>;
	readonly chain: <A, B>(fa: Sink<M, A>, f: (a: A) => Sink<M, B>) => Sink<M, B>;
	readonly ap: <A, B>(fab: Sink<M, (a: A) => B>, fa: Sink<M, A>) => Sink<M, B>;
	readonly newSink: <A>(value: A, effects: HKT<M, unknown>) => Sink<M, A>;
}

export interface Sink1<M extends URIS, A> {
	readonly value: A;
	readonly effects: Kind<M, unknown>;
}

export interface SinkM1<M extends URIS> {
	readonly map: <A, B>(fa: Sink1<M, A>, f: (a: A) => B) => Sink1<M, B>;
	readonly of: <A>(a: A) => Sink1<M, A>;
	readonly chain: <A, B>(fa: Sink1<M, A>, f: (a: A) => Sink1<M, B>) => Sink1<M, B>;
	readonly ap: <A, B>(fab: Sink1<M, (a: A) => B>, fa: Sink1<M, A>) => Sink1<M, B>;
	readonly newSink: <A>(value: A, effects: Kind<M, unknown>) => Sink1<M, A>;
}

export interface Sink2<M extends URIS2, A> {
	readonly value: A;
	readonly effects: Kind2<M, unknown, unknown>;
}

export interface SinkM2<M extends URIS2> {
	readonly map: <A, B>(fa: Sink2<M, A>, f: (a: A) => B) => Sink2<M, B>;
	readonly of: <A>(a: A) => Sink2<M, A>;
	readonly chain: <A, B>(fa: Sink2<M, A>, f: (a: A) => Sink2<M, B>) => Sink2<M, B>;
	readonly ap: <A, B>(fab: Sink2<M, (a: A) => B>, fa: Sink2<M, A>) => Sink2<M, B>;
	readonly newSink: <A>(value: A, effects: Kind2<M, unknown, unknown>) => Sink2<M, A>;
}

export function getSink<M extends URIS2>(M: Alternative2<M>): SinkM2<M>;
export function getSink<M extends URIS>(M: Alternative1<M>): SinkM1<M>;
export function getSink<M>(M: Alternative<M>): SinkM<M>;
export function getSink<M>(M: Alternative<M>): SinkM<M> {
	const newSink = <A>(value: A, effects: HKT<M, unknown>): Sink<M, A> => ({
		value,
		effects,
	});
	return {
		newSink,
		of: a => newSink(a, M.zero()),
		ap: (fab, fa) =>
			newSink(
				fab.value(fa.value),
				M.alt(fab.effects, () => fa.effects),
			),
		map: (fa, f) => newSink(f(fa.value), fa.effects),
		chain: (fa, f) => {
			const fb = f(fa.value);
			return newSink(
				fb.value,
				M.alt(fa.effects, () => fb.effects),
			);
		},
	};
}
