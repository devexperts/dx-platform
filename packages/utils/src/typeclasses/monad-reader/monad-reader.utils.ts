import { Reader } from 'fp-ts/lib/Reader';
import { Kind2, URIS2 } from 'fp-ts/lib/HKT';
import { Omit } from 'typelevel-ts';
import { Monad2 } from 'fp-ts/lib/Monad';

export type ReaderEnvType<R extends Reader<any, any>> = R extends Reader<infer E, infer A> ? E : never;
export type ReaderValueType<R extends Reader<any, any>> = R extends Reader<infer E, infer A> ? A : never;

export interface MonadReader<F extends URIS2> extends Monad2<F> {
	readonly asks: <E, A>(f: (e: E) => A) => Kind2<F, E, A>;
	readonly runReader: <E, A>(fa: Kind2<F, E, A>, e: E) => A;
}

export function defer<F extends URIS2>(F: MonadReader<F>) {
	return <E extends object, A, K extends keyof E>(
		fa: Kind2<F, E, A>,
		...keys: K[]
	): Kind2<F, Omit<E, K>, Kind2<F, Pick<E, K>, A>> =>
		F.asks(outerE => F.asks(innerE => F.runReader(fa, Object.assign({}, outerE, innerE) as E)));
}
