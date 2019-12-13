import { HKT, Kind, Kind2, URIS, URIS2 } from 'fp-ts/lib/HKT';
import { Filterable, Filterable1, Filterable2 } from 'fp-ts/lib/Filterable';
import { Decoder } from 'io-ts';
import { isRight } from 'fp-ts/lib/Either';
import { none, some } from 'fp-ts/lib/Option';
import { PathReporter } from 'io-ts/lib/PathReporter';

export function decode<F extends URIS2>(
	F: Filterable2<F>,
): <A>(codec: Decoder<unknown, A>) => <E>(fa: Kind2<F, E, unknown>) => Kind2<F, E, A>;
export function decode<F extends URIS>(
	F: Filterable1<F>,
): <A>(codec: Decoder<unknown, A>) => (fa: Kind<F, unknown>) => Kind<F, A>;
export function decode<F>(F: Filterable<F>): <A>(decoder: Decoder<unknown, A>) => (fa: HKT<F, unknown>) => HKT<F, A>;
export function decode<F>(F: Filterable<F>): <A>(decoder: Decoder<unknown, A>) => (fa: HKT<F, unknown>) => HKT<F, A> {
	return codec => fa =>
		F.filterMap(fa, a => {
			const decoded = codec.decode(a);
			if (isRight(decoded)) {
				return some(decoded.right);
			} else {
				console.error('Validation has errors', a, PathReporter.report(decoded));
			}
			return none;
		});
}
