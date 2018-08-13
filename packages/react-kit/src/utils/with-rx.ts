import { Component, ComponentClass, ComponentType, createElement } from 'react';
import { BehaviorSubject, isObservable, Observable, Subscription } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

// tslint:disable-next-line
const hoistNonReactStatics = require('hoist-non-react-statics');

export type WithRXSelectorResultPropsOnly<P> = Observable<Partial<P>>;
export type WithRXSelectorResultWithEffects<P> = {
	props$: Observable<Partial<P>>;
	effects$: Observable<void>;
};

export type ComponentDecorator<P> = (Target: ComponentType<P>) => ComponentClass<P>;
export type WithRXSelectorResult<P> = WithRXSelectorResultPropsOnly<P> | WithRXSelectorResultWithEffects<P>;
export type WithRXSelector<P> = (props$: Observable<Readonly<P>>) => WithRXSelectorResult<P>;

export function withRX<P extends object = never>(select: WithRXSelector<P>): ComponentDecorator<P> {
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
