import { ComponentClass, ComponentType, createElement, PureComponent } from 'react';
import { BehaviorSubject, merge, Observable, SchedulerLike, Subscription } from 'rxjs';
import { map, observeOn } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { Omit } from 'typelevel-ts';

// tslint:disable-next-line
const hoistNonReactStatics = require('hoist-non-react-statics');

export type Observify<P extends object> = { readonly [K in keyof P]: Observable<P[K]> };

export type WithRXSelectorResult<P extends object, D extends Partial<P>> = {
	props?: Partial<Observify<P>>;
	defaultProps?: D;
	effects$?: Observable<unknown>;
};

export type WithRXOptions = {
	scheduler?: SchedulerLike;
};

export function withRX<P extends object, D extends Partial<P>>(
	Target: ComponentType<P>,
	selector: (props$: Observable<Readonly<P>>) => WithRXSelectorResult<P, D>,
	options: WithRXOptions = {},
): ComponentClass<Omit<P, keyof D> & Partial<D>> {
	const scheduler = options.scheduler || animationFrame;

	class WithRX extends PureComponent<P, Partial<P>> {
		static displayName = `WithRX(${Target.displayName || Target.name})`;

		private readonly props$ = new BehaviorSubject<P>(this.props);
		private readonly selected = selector(this.props$.asObservable());
		private inputSubscription?: Subscription;
		private effectsSubscription?: Subscription;

		componentDidMount() {
			const { props, effects$ } = this.selected;
			if (props) {
				const inputs = Object.keys(props).map(key =>
					props[key].pipe(map((value: unknown) => ({ [key]: value }))),
				);
				this.inputSubscription = merge(...inputs)
					.pipe(observeOn(scheduler))
					.subscribe(this.setState.bind(this));
			}
			if (effects$) {
				this.effectsSubscription = effects$.pipe(observeOn(scheduler)).subscribe();
			}
		}

		componentWillReceiveProps(props: P) {
			this.props$.next(props);
		}

		componentWillUnmount() {
			this.inputSubscription && this.inputSubscription.unsubscribe();
			this.effectsSubscription && this.effectsSubscription.unsubscribe();
		}

		render() {
			return createElement(Target, Object.assign({}, this.selected.defaultProps, this.props, this.state || {}));
		}
	}

	hoistNonReactStatics(WithRX, Target);

	return WithRX as any; //defaultProps are tracked by defaultProps argument;
}
