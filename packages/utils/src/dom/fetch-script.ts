import { HKT, Kind, Kind2, Kind3, URIS, URIS2, URIS3 } from 'fp-ts/lib/HKT';
import {
	MonadObservable,
	MonadObservable1,
	MonadObservable2,
	MonadObservable2C,
	MonadObservable3,
} from '../typeclasses/monad-observable/monad-observable';
import { MonadThrow, MonadThrow1, MonadThrow2, MonadThrow2C, MonadThrow3 } from 'fp-ts/lib/MonadThrow';
import {
	fromProgressEvent,
	MonadProgress,
	MonadProgress1,
	MonadProgress2,
	MonadProgress2C,
	MonadProgress3,
} from '../typeclasses/monad-progress/monad-progress';

export type FetchScriptConfig = {
	shouldRemoveOnDispose?: boolean;
	shouldTrackProgress?: boolean;
};

export function fetchScript<O extends URIS3, A extends URIS3>(
	O: MonadObservable3<O>,
	A: MonadThrow3<A> & MonadProgress3<A>,
): <OR, OE, AR, AE>(src: string, config?: FetchScriptConfig) => Kind3<O, OR, OE, Kind3<A, AR, AE, void>>;
export function fetchScript<O extends URIS3, A extends URIS2, AE>(
	O: MonadObservable3<O>,
	A: MonadThrow2C<A, AE> & MonadProgress2C<A, AE>,
): <OR, OE>(src: string, config?: FetchScriptConfig) => Kind3<O, OR, OE, Kind2<A, AE, void>>;
export function fetchScript<O extends URIS3, A extends URIS2>(
	O: MonadObservable3<O>,
	A: MonadThrow2<A> & MonadProgress2<A>,
): <OR, OE, AE>(src: string, config?: FetchScriptConfig) => Kind3<O, OR, OE, Kind2<A, AE, void>>;
export function fetchScript<O extends URIS3, A extends URIS>(
	O: MonadObservable3<O>,
	A: MonadThrow1<A> & MonadProgress1<A>,
): <OR, OE>(src: string, config?: FetchScriptConfig) => Kind3<O, OR, OE, Kind<A, void>>;
export function fetchScript<O extends URIS3, A>(
	O: MonadObservable3<O>,
	A: MonadThrow<A> & MonadProgress<A>,
): <OR, OE>(src: string, config?: FetchScriptConfig) => Kind3<O, OR, OE, HKT<A, void>>;

export function fetchScript<O extends URIS2, A extends URIS3, OE>(
	O: MonadObservable2C<O, OE>,
	A: MonadThrow3<A> & MonadProgress3<A>,
): <AR, AE>(src: string, config?: FetchScriptConfig) => Kind2<O, OE, Kind3<A, AR, AE, void>>;
export function fetchScript<O extends URIS2, A extends URIS2, OE, AE>(
	O: MonadObservable2C<O, OE>,
	A: MonadThrow2C<A, AE> & MonadProgress2C<A, AE>,
): (src: string, config?: FetchScriptConfig) => Kind2<O, OE, Kind2<A, AE, void>>;
export function fetchScript<O extends URIS2, A extends URIS2, OE>(
	O: MonadObservable2C<O, OE>,
	A: MonadThrow2<A> & MonadProgress2<A>,
): <AE>(src: string, config?: FetchScriptConfig) => Kind2<O, OE, Kind2<A, AE, void>>;
export function fetchScript<O extends URIS2, A extends URIS, OE>(
	O: MonadObservable2C<O, OE>,
	A: MonadThrow1<A> & MonadProgress1<A>,
): (src: string, config?: FetchScriptConfig) => Kind2<O, OE, Kind<A, void>>;
export function fetchScript<O extends URIS2, A, OE>(
	O: MonadObservable2C<O, OE>,
	A: MonadThrow<A> & MonadProgress<A>,
): (src: string, config?: FetchScriptConfig) => Kind2<O, OE, HKT<A, void>>;

export function fetchScript<O extends URIS2, A extends URIS3>(
	O: MonadObservable2<O>,
	A: MonadThrow3<A> & MonadProgress3<A>,
): <OE, AR, AE>(src: string, config?: FetchScriptConfig) => Kind2<O, OE, Kind3<A, AR, AE, void>>;
export function fetchScript<O extends URIS2, A extends URIS2, AE>(
	O: MonadObservable2<O>,
	A: MonadThrow2C<A, AE> & MonadProgress2C<A, AE>,
): <OE>(src: string, config?: FetchScriptConfig) => Kind2<O, OE, Kind2<A, AE, void>>;
export function fetchScript<O extends URIS2, A extends URIS2>(
	O: MonadObservable2<O>,
	A: MonadThrow2<A> & MonadProgress2<A>,
): <OE, AE>(src: string, config?: FetchScriptConfig) => Kind2<O, OE, Kind2<A, AE, void>>;
export function fetchScript<O extends URIS2, A extends URIS>(
	O: MonadObservable2<O>,
	A: MonadThrow1<A> & MonadProgress1<A>,
): <OE>(src: string, config?: FetchScriptConfig) => Kind2<O, OE, Kind<A, void>>;
export function fetchScript<O extends URIS2, A>(
	O: MonadObservable2<O>,
	A: MonadThrow<A> & MonadProgress<A>,
): <OE>(src: string, config?: FetchScriptConfig) => Kind2<O, OE, HKT<A, void>>;

export function fetchScript<O extends URIS, A extends URIS3>(
	O: MonadObservable1<O>,
	A: MonadThrow3<A> & MonadProgress3<A>,
): <AR, AE>(src: string, config?: FetchScriptConfig) => Kind<O, Kind3<A, AR, AE, void>>;
export function fetchScript<O extends URIS, A extends URIS2, AE>(
	O: MonadObservable1<O>,
	A: MonadThrow2C<A, AE> & MonadProgress2C<A, AE>,
): (src: string, config?: FetchScriptConfig) => Kind<O, Kind2<A, AE, void>>;
export function fetchScript<O extends URIS, A extends URIS2>(
	O: MonadObservable1<O>,
	A: MonadThrow2<A> & MonadProgress2<A>,
): <AE>(src: string, config?: FetchScriptConfig) => Kind<O, Kind2<A, AE, void>>;
export function fetchScript<O extends URIS, A extends URIS>(
	O: MonadObservable1<O>,
	A: MonadThrow1<A> & MonadProgress1<A>,
): (src: string, config?: FetchScriptConfig) => Kind<O, Kind<A, void>>;
export function fetchScript<O extends URIS, A>(
	O: MonadObservable1<O>,
	A: MonadThrow<A> & MonadProgress<A>,
): (src: string, config?: FetchScriptConfig) => Kind<O, HKT<A, void>>;

export function fetchScript<O, A extends URIS3>(
	O: MonadObservable<O>,
	A: MonadThrow3<A> & MonadProgress3<A>,
): <AR, AE>(src: string, config?: FetchScriptConfig) => HKT<O, Kind3<A, AR, AE, void>>;
export function fetchScript<O, A extends URIS2, AE>(
	O: MonadObservable<O>,
	A: MonadThrow2C<A, AE> & MonadProgress2C<A, AE>,
): (src: string, config?: FetchScriptConfig) => HKT<O, Kind2<A, AE, void>>;
export function fetchScript<O, A extends URIS2>(
	O: MonadObservable<O>,
	A: MonadThrow2<A> & MonadProgress2<A>,
): <AE>(src: string, config?: FetchScriptConfig) => HKT<O, Kind2<A, AE, void>>;
export function fetchScript<O, A extends URIS>(
	O: MonadObservable<O>,
	A: MonadThrow1<A> & MonadProgress1<A>,
): (src: string, config?: FetchScriptConfig) => HKT<O, Kind<A, void>>;
export function fetchScript<O, A>(
	O: MonadObservable<O>,
	A: MonadThrow<A> & MonadProgress<A>,
): (src: string, config?: FetchScriptConfig) => HKT<O, HKT<A, void>>;
export function fetchScript<O, A>(
	O: MonadObservable<O>,
	A: MonadThrow<A> & MonadProgress<A>,
): (src: string, config?: FetchScriptConfig) => HKT<O, HKT<A, void>> {
	const fromProgressEventM = fromProgressEvent(A);
	return (src, config = {}) =>
		O.fromObservable({
			subscribe: observer => {
				const script = document.createElement('script');
				script.async = true;
				script.src = src;
				script.onload = () => {
					observer.next(A.of(undefined));
					observer.end();
				};
				script.onerror = () => {
					observer.next(A.throwError(new Error(`Cannot fetch script: ${src}`)));
					observer.end();
				};
				if (config.shouldTrackProgress) {
					script.onprogress = e => {
						observer.next(fromProgressEventM(e));
					};
				}

				document.body.appendChild(script);
				return {
					unsubscribe() {
						if (config.shouldRemoveOnDispose) {
							document.removeChild(script);
						}
					},
				};
			},
		});
}
