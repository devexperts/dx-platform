import { Observable, Subject } from 'rxjs';

export type THandler<A> = {
	readonly handle: (value: A) => void;
	readonly value$: Observable<A>;
};

/**
 * Returns an object consisting of an observable `value` and a `handle` function that
 * allows to send emissions to this observable.
 * 
 * This function helps to implement the 'controlled component' React pattern using RxJS
 * streams. For example, a simple container might look like this:
 * 
 * ```ts
 * // WithRX selector
 * const propsSelector = () => {
 *     const userName = createHandler<string>();
 *     return {
 *         defaultProps: {
 *             userName: '',
 *             onUserNameChange: () => {}
 *         },
 *         props: {
 *             // using the 'value$' part to pass the observable value into the component props
 *             userName: userName.value$,
 *             // 'handle' can be passed as a callback to the input's onChange event
 *             onUserNameChange: Observable.of(onValueChange.handle)
 *         }
 *     };
 * }
 * 
 * // Component
 * const RawGreetingForm = ({userName, onUserNameChange}) =>
 *     <input type="text" value={userName} onChange={onUserNameChange} />;
 * 
 * // Wrapping the component into withRX
 * const GreetingForm = withRX(RawGreetingForm)(propsSelector);
 * ```
 */
export const createHandler = <A = void>(): THandler<A> => {
	const value = new Subject<A>();
	const handle = (val: A) => value.next(val);

	return {
		value$: value.asObservable(),
		handle,
	};
};
