import { Either, either as fptseither, isRight, right, URI } from 'fp-ts/lib/Either';
import { tuple } from 'fp-ts/lib/function';
import {
	CoproductLeft,
	coproductMapLeft,
} from '../typeclasses/product-left-coproduct-left/product-left-coproduct-left.utils';
import { sequenceT } from 'fp-ts/lib/Apply';
import { array } from 'fp-ts/lib/Array';

const coproductLeft = <LA, A, LB, B>(fa: Either<LA, A>, fb: Either<LB, B>): Either<LA | LB, [A, B]> => {
	if (isRight(fa)) {
		if (isRight(fb)) {
			return right(tuple(fa.right, fb.right));
		}
		return fb as any;
	}
	return fa as any;
};

export const either: typeof fptseither & CoproductLeft<URI> = {
	...fptseither,
	coproductLeft,
};

export const combineEither = coproductMapLeft(either);
export const sequenceTEither = sequenceT(either);
export const sequenceEither = array.sequence(either);

export type LeftType<F extends Either<any, any>> = F extends Either<infer L, infer A> ? L : never;
export type RightType<F extends Either<any, any>> = F extends Either<infer L, infer A> ? A : never;
