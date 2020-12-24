import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from 'fp-ts/lib/HKT';
import { Foldable, Foldable1, Foldable2, Foldable2C, Foldable3, Foldable4 } from 'fp-ts/lib/Foldable';
import { identity } from 'fp-ts/lib/function';

export interface FoldableValue<F> extends Foldable<F> {
	readonly foldValue: <A, B>(fa: HKT<F, A>, onNever: (fn: HKT<F, never>) => B, onValue: (a: A) => B) => B;
}

export interface FoldableValue1<F extends URIS> extends Foldable1<F> {
	readonly foldValue: <A, B>(fa: Kind<F, A>, onNever: (fn: Kind<F, never>) => B, onValue: (a: A) => B) => B;
}

export interface FoldableValue2<F extends URIS2> extends Foldable2<F> {
	readonly foldValue: <E, A, B>(
		fa: Kind2<F, E, A>,
		onNever: (fn: Kind2<F, E, never>) => B,
		onValue: (a: A) => B,
	) => B;
}

export interface FoldableValue2C<F extends URIS2, E> extends Foldable2C<F, E> {
	readonly foldValue: <A, B>(fa: Kind2<F, E, A>, onNever: (fn: Kind2<F, E, never>) => B, onValue: (a: A) => B) => B;
}

export interface FoldableValue3<F extends URIS3> extends Foldable3<F> {
	readonly foldValue: <R, E, A, B>(
		fa: Kind3<F, R, E, A>,
		onNever: (fn: Kind3<F, R, E, never>) => B,
		onValue: (a: A) => B,
	) => B;
}

export interface FoldableValue4<F extends URIS4> extends Foldable4<F> {
	readonly foldValue: <S, R, E, A, B>(
		fa: Kind4<F, S, R, E, A>,
		onNever: (fn: Kind4<F, S, R, E, never>) => B,
		onValue: (a: A) => B,
	) => B;
}

export function getOrElse<F extends URIS4>(
	F: FoldableValue4<F>,
): <A>(onNever: () => A) => <S, R, E>(fa: Kind4<F, S, R, E, A>) => A;
export function getOrElse<F extends URIS3>(
	F: FoldableValue3<F>,
): <A>(onNever: () => A) => <R, E>(fa: Kind3<F, R, E, A>) => A;
export function getOrElse<F extends URIS2>(F: FoldableValue2<F>): <A>(onNever: () => A) => <E>(fa: Kind2<F, E, A>) => A;
export function getOrElse<F extends URIS2, E>(
	F: FoldableValue2C<F, E>,
): <A>(onNever: () => A) => (fa: Kind2<F, E, A>) => A;
export function getOrElse<F extends URIS>(F: FoldableValue1<F>): <A>(onNever: () => A) => (fa: Kind<F, A>) => A;
export function getOrElse<F>(F: FoldableValue<F>): <A>(onNever: () => A) => (fa: HKT<F, A>) => A;
export function getOrElse<F>(F: FoldableValue<F>): <A>(onNever: () => A) => (fa: HKT<F, A>) => A {
	return onNever => fa => F.foldValue(fa, onNever, identity);
}
