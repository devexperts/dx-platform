import { Component, ComponentClass, ComponentType, createElement } from 'react';
import { BehaviorSubject, isObservable, Observable, Subscription } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

// tslint:disable-next-line
const hoistNonReactStatics = require('hoist-non-react-statics');

/**
 * Stream of props that should be passed to the wrapped component. Each emitted item should be
 * an object containing a subset of component's props type. For example, in order to update the
 * `time` and `formattedTime` props, the stream should emit `{time: 1234000000, formattedTime: '11:12:01'}`,
 * or emit separately `{time: 1234000000}` and `{formattedTime: '11:12:01'}`
 *
 * @deprecated
 */
export type WithRXSelectorResultPropsOnly<P> = Observable<Partial<P>>;
/**
 * @deprecated
 */
export type WithRXSelectorResultWithEffects<P> = {
	/**
	 * Stream of props that should be passed to the wrapped component. Each emitted item should be
	 * an object containing a subset of component's props type. For example, in order to update the
	 * `time` and `formattedTime` props, the stream should emit `{time: 1234000000, formattedTime: '11:12:01'}`,
	 * or emit separately `{time: 1234000000}` and `{formattedTime: '11:12:01'}`
	 */
	props$: Observable<Partial<P>>;
	/**
	 * Stream of so-called effects - the streams that are not displayed in the UI but trigger some
	 * side-effects, such as sending requests
	 */
	effects$: Observable<void>;
};

/**
 * @deprecated
 */
export type ComponentDecorator<P> = (Target: ComponentType<P>) => ComponentClass<P>;
/**
 * @deprecated
 */
export type WithRXSelectorResult<P> = WithRXSelectorResultPropsOnly<P> | WithRXSelectorResultWithEffects<P>;
/**
 * Function that maps the stream of input props into the stream of props that will be applied to the
 * wrapped component. The returned value may optionally declare the `effects$` - the streams that will
 * be subscribed on but not passed to the component props.
 *
 * @deprecated
 */
export type WithRXSelector<P> = (props$: Observable<Readonly<P>>) => WithRXSelectorResult<P>;

/**
 * Higher order component that allows to pass the values emitted by RxJS streams as props to the target component.
 *
 * ```ts
 * const CounterComponent = ({time}) => <div>Current time is {time}</div>;
 * const selector = props$ => {
 *     return Observable.interval()
 *         .map(() => Date.now())
 *         .withLatestFrom(props$.map(props => props.format))	// access the input prop "format"
 *         .map(([timestamp, fmt]) => format(timestamp, fmt))
 *         .map(time => ({time}))    // wrap the value in an object like {time: "10:58:01"}
 *                                   // which can be mixed into the CounterComponent props
 * }
 * const Counter = withRX(selector)(CounterComponent);
 *
 * // render:
 * const elem = <Counter format="HH:mm:ss" />;
 * ```
 *
 * @deprecated
 */
export function withRX<P extends object = never>(select: WithRXSelector<P>): ComponentDecorator<P> {
	/**
	 * @deprecated
	 */
	return Target => {
		class WithRX extends Component<P> {
			static displayName = `WithRX(${Target.displayName || Target.name})`;

			private props$ = new BehaviorSubject(this.props);
			private selectResult = select(this.props$.asObservable());
			private input$ = isObservable(this.selectResult) ? this.selectResult : this.selectResult.props$;
			private effect$ = !isObservable(this.selectResult) ? this.selectResult.effects$ : undefined;
			private inputSubscription?: Subscription;
			private effectSubscription?: Subscription;

			componentDidMount() {
				this.inputSubscription = this.input$
					.pipe(observeOn(animationFrame))
					.subscribe(this.setState.bind(this));

				if (this.effect$) {
					this.effectSubscription = this.effect$.pipe(observeOn(animationFrame)).subscribe();
				}
			}

			componentWillReceiveProps(props: P) {
				this.props$.next(props);
			}

			componentWillUnmount() {
				this.inputSubscription && this.inputSubscription.unsubscribe();
				this.effectSubscription && this.effectSubscription.unsubscribe();
			}

			render() {
				return createElement(Target, Object.assign({}, this.props, this.state));
			}
		}

		hoistNonReactStatics(WithRX, Target);

		return WithRX;
	};
}
