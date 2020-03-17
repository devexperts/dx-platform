import { observable as rxjs, URI } from 'fp-ts-rxjs/lib/Observable';
import { MonadObservable1 } from '@devexperts/utils/dist/typeclasses/monad-observable/monad-observable';
import { Observable, Subject } from 'rxjs';
import { pipe, pipeable } from 'fp-ts/lib/pipeable';
import { share, switchMap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { task } from 'fp-ts/lib/Task';

export const instanceObservable: typeof rxjs & MonadObservable1<URI> = {
	...rxjs,
	chain: (fa, f) => pipe(fa, switchMap(f)),
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

const zero: () => Observable<never> = instanceObservable.zero;
export const observable = {
	...instanceObservable,
	...pipeable(instanceObservable),
	zero,
};
