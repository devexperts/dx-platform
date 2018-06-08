import { RemoteInitial, RemoteSuccess, RemoteFailure, RemotePending, RemoteData } from '@devexperts/remote-data-ts';

export const initial: RemoteInitial<never, never> = new RemoteInitial<never, never>();
export const pending: RemotePending<never, never> = new RemotePending<never, never>();
export const failure = <L, A>(error: L): RemoteFailure<L, A> => new RemoteFailure(error);
export const success = <L, A>(value: A): RemoteSuccess<L, A> => new RemoteSuccess(value);

export const isFailure = <L, A>(data: RemoteData<L, A>): data is RemoteFailure<L, A> => data.isFailure();
export const isSuccess = <L, A>(data: RemoteData<L, A>): data is RemoteSuccess<L, A> => data.isSuccess();
export const isPending = <L, A>(data: RemoteData<L, A>): data is RemotePending<L, A> => data.isPending();
export const isInitial = <L, A>(data: RemoteData<L, A>): data is RemoteInitial<L, A> => data.isInitial();
