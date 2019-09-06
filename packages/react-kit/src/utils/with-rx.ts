import { Component, ComponentClass, ComponentType, createElement } from 'react';
import { BehaviorSubject, isObservable, Observable, Subscription } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const hoistNonReactStatics = require('hoist-non-react-statics'); // tslint:disable-line no-require-imports no-var-requires

/**
 * @deprecated
 */
export type WithRXSelectorResultPropsOnly<P> = Observable<Partial<P>>;
/**
 * @deprecated
 */
export type WithRXSelectorResultWithEffects<P> = {
	props$: Observable<Partial<P>>;
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
 * @deprecated
 */
export type WithRXSelector<P> = (props$: Observable<Readonly<P>>) => WithRXSelectorResult<P>;

/**
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
