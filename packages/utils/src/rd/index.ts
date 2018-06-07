import { RemoteInitial, RemoteSuccess, RemoteFailure, RemotePending } from '@devexperts/remote-data-ts';

export const initial: RemoteInitial<never, never> = new RemoteInitial<never, never>();
export const pending: RemotePending<never, never> = new RemotePending<never, never>();
export const failure = <L, A>(error: L): RemoteFailure<L, A> => new RemoteFailure(error);
export const success = <L, A>(value: A): RemoteSuccess<L, A> => new RemoteSuccess(value);
