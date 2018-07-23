import { Component, ComponentClass, ComponentType, createElement } from 'react';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { animationFrame } from 'rxjs/scheduler/animationFrame';
import 'rxjs/add/operator/subscribeOn';

// tslint:disable-next-line
const hoistNonReactStatics = require('hoist-non-react-statics');

export type ComponentDecorator<P> = (Target: ComponentType<P>) => ComponentClass<P>;
export type WithRXSelectorResult<P> = {
	props$: Observable<Partial<P>>;
	effects$: Observable<void>;
};
export type WithRXSelector<P> = (props$: Observable<Readonly<P>>) => WithRXSelectorResult<P>;

export function withRX<P extends object = never>(select: WithRXSelector<P>): ComponentDecorator<P> {
	return Target => {
		class WithRX extends Component<P> {
			static displayName = `WithRX(${Target.displayName || Target.name})`;

			private props$ = new BehaviorSubject(this.props);
			private selectResult = select(this.props$.asObservable());
			private input$ = this.selectResult.props$;
			private effect$ = this.selectResult.effects$;
			private inputSubscription: Subscription;
			private effectSubscription: Subscription;

			constructor(props: P) {
				super(props);

				this.inputSubscription = this.input$
					.subscribeOn(animationFrame)
					.subscribe(state => this.setState(state));

				this.effectSubscription = this.effect$.subscribeOn(animationFrame).subscribe();
			}

			componentWillReceiveProps(props: P) {
				this.props$.next(props);
			}

			componentWillUnmount() {
				this.inputSubscription.unsubscribe();
				this.effectSubscription.unsubscribe();
			}

			render() {
				return createElement(Target, Object.assign({}, this.props, this.state));
			}
		}

		hoistNonReactStatics(WithRX, Target);

		return WithRX;
	};
}
