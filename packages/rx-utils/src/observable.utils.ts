import { observable as rxjs, URI } from 'fp-ts-rxjs/lib/Observable';
import { MonadObservable1 } from '@devexperts/utils/dist/typeclasses/monad-observable/monad-observable';
import { Observable, Subject } from 'rxjs';
import { pipe } from 'fp-ts/lib/pipeable';
import { share } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { task } from 'fp-ts/lib/Task';

export const observable: typeof rxjs & MonadObservable1<URI> = {
	...rxjs,
	createAdapter: <A>() => {
		const s = new Subject<A>();
		const next = (a: A) => s.next(a);
		return [next, s.asObservable()];
	},
	fromEvent: (target: WindowEventHandlers | EventTarget, event: string) =>
		pipe(
			new Observable<Event>(subscriber => {
				const handler = (e: Event) => subscriber.next(e);
				target.addEventListener(event, handler);
				return () => target.removeEventListener(event, handler);
			}),
			share(),
		),
	fromObservable: observable =>
		new Observable(subscriber =>
			observable.subscribe({
				end() {
					subscriber.complete();
				},
				next(e) {
					subscriber.next(e);
				},
			}),
		),
	fromTask: fa => fromPromise(fa()),
	fromIO: fa => fromPromise(task.fromIO(fa)()),
	subscribe: (fa, observer) =>
		fa.subscribe({
			next(e) {
				observer.next(e);
			},
			complete() {
				observer.end();
			},
		}),
};
