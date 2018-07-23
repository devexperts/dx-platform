import { Observable } from 'rxjs';
import { RemoteData } from '@devexperts/remote-data-ts';
import { Option } from 'fp-ts/lib/Option';
import { AjaxError } from 'rxjs/ajax';

export type LiveData<A> = Observable<RemoteData<AjaxError, A>>;
export type LiveDataOption<A> = Observable<RemoteData<AjaxError, Option<A>>>;
