import { Component, ComponentClass, ComponentType, createElement } from 'react';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { animationFrame } from 'rxjs/scheduler/animationFrame';
import 'rxjs/add/operator/subscribeOn';

// tslint:disable-next-line
const hoistNonReactStatics = require('hoist-non-react-statics');

export type ComponentDecorator<P> = (Target: ComponentType<P>) => ComponentClass<P>;
export type WithRXSelector<P> = (props$: Observable<Readonly<P>>) => Observable<Partial<Readonly<P>>>;

export function withRX<P extends object = never>(select: WithRXSelector<P>): ComponentDecorator<P> {
	return Target => {
		class WithRX extends Component<P> {
			static displayName = `WithRX(${Target.displayName || Target.name})`;

			private props$ = new BehaviorSubject(this.props);
			private results$ = select(this.props$.asObservable());
			private resultsSubscription: Subscription;

			constructor(props: P) {
				super(props);

				this.resultsSubscription = this.results$
					.subscribeOn(animationFrame)
					.subscribe(state => this.setState(state));
			}

			componentWillReceiveProps(props: P) {
				this.props$.next(props);
			}

			componentWillUnmount() {
				this.resultsSubscription.unsubscribe();
			}

			render() {
				return createElement(Target, Object.assign({}, this.props, this.state));
			}
		}

		hoistNonReactStatics(WithRX, Target);

		return WithRX;
	};
}
