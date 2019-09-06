import { ComponentClass, ComponentType, createElement, PureComponent } from 'react';
import { BehaviorSubject, merge, Observable, SchedulerLike, Subscription } from 'rxjs';
import { map, observeOn } from 'rxjs/operators';
import { Omit } from 'typelevel-ts';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const hoistNonReactStatics = require('hoist-non-react-statics'); // tslint:disable-line no-require-imports no-var-requires

export type Observify<P extends object> = { readonly [K in keyof P]: Observable<P[K]> };

export type WithRXSelectorResult<P extends object, D extends Partial<P>> = {
	props?: Partial<Observify<P>>;
	defaultProps?: D;
	effects$?: Observable<unknown>;
};

export type WithRXOptions = {
	scheduler?: SchedulerLike;
};

/**
 * curried for better type inference
 * @see https://github.com/Microsoft/TypeScript/issues/15005#issuecomment-430588884
 */
export const withRX = <P extends object>(Target: ComponentType<P>) => <D extends Partial<P>>(
	selector: (props$: Observable<Readonly<P>>) => WithRXSelectorResult<P, D>,
	options: WithRXOptions = {},
): ComponentClass<Omit<P, keyof D> & Partial<D>> => {
	class WithRX extends PureComponent<P, Partial<P>> {
		static displayName = `WithRX(${Target.displayName || Target.name})`;

		private readonly props$ = new BehaviorSubject<P>(this.props);
		private readonly selected = selector(this.props$.asObservable());
		private inputSubscription?: Subscription;
		private effectsSubscription?: Subscription;

		componentDidMount() {
			const { props, effects$ } = this.selected;
			if (props) {
				const inputs: Observable<Partial<P>>[] = Object.keys(props).map(key =>
					props[key].pipe(map(value => ({ [key]: value }))),
				);
				const merged = merge(...inputs);
				const result = options.scheduler ? merged.pipe(observeOn(options.scheduler)) : merged;
				this.inputSubscription = result.subscribe(this.setState.bind(this));
			}
			if (effects$) {
				this.effectsSubscription = effects$.subscribe();
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
};
