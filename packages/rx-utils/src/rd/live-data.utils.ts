import { Observable } from 'rxjs';
import { RemoteData } from '@devexperts/remote-data-ts';
import { Option } from 'fp-ts/lib/Option';

export type LiveData<L, A> = Observable<RemoteData<L, A>>;
export type LiveDataOption<L, A> = Observable<RemoteData<L, Option<A>>>;
