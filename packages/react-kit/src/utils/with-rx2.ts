import { ComponentClass, ComponentType, createElement, PureComponent } from 'react';
import { BehaviorSubject, merge, Observable, SchedulerLike, Subscription } from 'rxjs';
import { map, observeOn } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { PartialKeys } from '@devexperts/utils/src/object';

// tslint:disable-next-line
const hoistNonReactStatics = require('hoist-non-react-statics');

export type Observify<P extends object> = { readonly [K in keyof P]: Observable<P[K]> };

export type WithRXSelectorResult<P extends object> = {
	props?: Partial<Observify<P>>;
	effects$?: Observable<unknown>;
};

export type TWithRXOptions = {
	scheduler?: SchedulerLike;
};

export function withRX<P extends D, D extends object>(
	Target: ComponentType<P>,
	defaultProps: D,
	selector: (props$: Observable<Readonly<P>>) => WithRXSelectorResult<P>,
	options: TWithRXOptions = {},
): ComponentClass<PartialKeys<P, keyof D>> {
	const scheduler = options.scheduler || animationFrame;

	class WithRX extends PureComponent<P, Partial<P>> {
		readonly state: Partial<P> = this.props;
		static displayName = `WithRX(${Target.displayName || Target.name})`;
		static defaultProps = defaultProps;

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
			return createElement(Target, Object.assign({}, this.props, this.state));
		}
	}

	hoistNonReactStatics(WithRX, Target);

	return WithRX as any; //defaultProps are tracked by defaultProps argument;
}
