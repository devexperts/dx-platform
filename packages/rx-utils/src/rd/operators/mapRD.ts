import { OperatorFunction } from 'rxjs';
import { RemoteData, map as mapRemoteData } from '@devexperts/remote-data-ts';
import { map } from 'rxjs/operators';

export const mapRD = <L, A, B>(f: (a: A) => B): OperatorFunction<RemoteData<L, A>, RemoteData<L, B>> =>
	map(mapRemoteData(f));
