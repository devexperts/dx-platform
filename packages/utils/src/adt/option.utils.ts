import { sequenceT } from 'fp-ts/lib/Apply';
import { Option, option } from 'fp-ts/lib/Option';

export const sequenceTOption = sequenceT(option);

export type OptionType<FA extends Option<any>> = FA extends Option<infer A> ? A : never;
