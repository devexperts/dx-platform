import { ComponentClass, ComponentType, createElement, PureComponent } from 'react';
import { BehaviorSubject, merge, Observable, Subscription } from 'rxjs';
import { map, observeOn } from 'rxjs/operators';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { PartialKeys } from '@devexperts/utils/src/object';

// tslint:disable-next-line
const hoistNonReactStatics = require('hoist-non-react-statics');

export type Observify<P extends object> = { readonly [K in keyof P]: Observable<P[K]> };

const WithRXSelectorResultTag = Symbol('WithRXSelectorResult');
export type WithRXSelectorResultTag = typeof WithRXSelectorResultTag;
export type WithRXSelectorResult<P extends object> = {
	_tag: WithRXSelectorResultTag;
	props: Partial<Observify<P>>;
	effects$?: Observable<void>;
};
const select = <P extends object>(
	props: Partial<Observify<P>>,
	effects$?: Observable<void>,
): WithRXSelectorResult<P> => ({
	_tag: WithRXSelectorResultTag,
	props,
	effects$,
});

export function withRX<P extends D, D extends object>(
	Target: ComponentType<P>,
	selector: (
		props$: Observable<Readonly<P>>,
		select: (props: Partial<Observify<P>>, effects$?: Observable<void>) => WithRXSelectorResult<P>,
	) => WithRXSelectorResult<P>,
	defaultProps?: D,
): ComponentClass<PartialKeys<P, keyof D>> {
	class WithRX extends PureComponent<P, Partial<P>> {
		readonly state: Partial<P> = this.props;
		static displayName = `WithRX(${Target.displayName || Target.name})`;
		static defaultProps = defaultProps;

		private readonly props$ = new BehaviorSubject<P>(this.props);
		private selected = selector(this.props$.asObservable(), select);
		private inputSubscription?: Subscription;
		private effectsSubscription?: Subscription;

		componentDidMount() {
			const inputs = Object.keys(this.selected.props).map(key =>
				this.selected.props[key].pipe(map((value: unknown) => ({ [key]: value }))),
			);
			this.inputSubscription = merge(...inputs)
				.pipe(observeOn(animationFrame))
				.subscribe(this.setState.bind(this));

			if (this.selected.effects$) {
				this.effectsSubscription = this.selected.effects$.pipe(observeOn(animationFrame)).subscribe();
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
