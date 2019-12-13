import { HKT, URIS, Kind, Kind2, URIS2 } from 'fp-ts/lib/HKT';
import {
	MonadObservable,
	MonadObservable1,
	MonadObservable2,
	Observer,
	Subscription,
} from '@devexperts/utils/src/typeclasses/monad-observable/monad-observable';
import { ComponentClass, ComponentType, createElement, PureComponent } from 'react';
import { constVoid } from 'fp-ts/lib/function';
import { array } from 'fp-ts/lib/Array';
import { Alternative2, Alternative1, Alternative } from 'fp-ts/lib/Alternative';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const hoistNonReactStatics = require('hoist-non-react-statics'); // tslint:disable-line no-require-imports no-var-requires

export type Observify<M, P extends object> = { readonly [K in keyof P]: HKT<M, P[K]> };
export type Observify1<M extends URIS, P extends object> = { readonly [K in keyof P]: Kind<M, P[K]> };
export type Observify2<M extends URIS2, P extends object, E> = { readonly [K in keyof P]: Kind2<M, E, P[K]> };

export interface WithObservableSelectorResult<M, P extends object, D extends Partial<P>> {
	props?: Partial<Observify<M, P>>;
	defaultProps?: D;
	effects$?: HKT<M, unknown>;
}
export interface WithObservableSelectorResult1<M extends URIS, P extends object, D extends Partial<P>> {
	props?: Partial<Observify1<M, P>>;
	defaultProps?: D;
	effects$?: Kind<M, unknown>;
}
export interface WithObservableSelectorResult2<M extends URIS2, P extends object, D extends Partial<P>, E> {
	props?: Partial<Observify2<M, P, E>>;
	defaultProps?: D;
	effects$?: Kind2<M, E, unknown>;
}

export interface WithObservable<M> {
	<P extends object>(Target: ComponentType<P>): <D extends Partial<P>>(
		selector: (props$: HKT<M, Readonly<P>>) => WithObservableSelectorResult<M, P, D>,
	) => ComponentClass<Omit<P, keyof D> & Partial<D>>;
}
export interface WithObservable1<M extends URIS> {
	<P extends object>(Target: ComponentType<P>): <D extends Partial<P>>(
		selector: (props$: Kind<M, Readonly<P>>) => WithObservableSelectorResult1<M, P, D>,
	) => ComponentClass<Omit<P, keyof D> & Partial<D>>;
}
export interface WithObservable2<M extends URIS2> {
	<P extends object>(Target: ComponentType<P>): <D extends Partial<P>>(
		selector: <E>(props$: Kind2<M, E, Readonly<P>>) => WithObservableSelectorResult2<M, P, D, E>,
	) => ComponentClass<Omit<P, keyof D> & Partial<D>>;
}

const voidObserver: Observer<unknown> = {
	next: constVoid,
	end: constVoid,
};

export function withObservable<M extends URIS2>(M: MonadObservable2<M> & Alternative2<M>): WithObservable2<M>;
export function withObservable<M extends URIS>(M: MonadObservable1<M> & Alternative1<M>): WithObservable1<M>;
export function withObservable<M>(M: MonadObservable<M> & Alternative<M>): WithObservable<M>;
export function withObservable<M>(M: MonadObservable<M> & Alternative<M>): WithObservable<M> {
	return <P extends object>(Target: ComponentType<P>) => <D extends Partial<P>>(
		selector: (props$: HKT<M, Readonly<P>>) => WithObservableSelectorResult<M, P, D>,
	): ComponentClass<Omit<P, keyof D> & Partial<D>> => {
		class WithObservable extends PureComponent<P, Partial<P>> {
			static displayName = `WithObservable(${Target.displayName || Target.name})`;

			private readonly adapter = M.createAdapter<P>();
			private readonly selected = selector(this.adapter[1]);
			private inputSubscription?: Subscription;
			private effectsSubscription?: Subscription;
			private setStateObserver: Observer<Partial<P>> = {
				next: this.setState.bind(this),
				end: constVoid,
			};

			componentDidMount(): void {
				const { props, effects$ } = this.selected;
				if (props) {
					const inputs: HKT<M, Partial<P>>[] = Object.keys(props).map(key =>
						M.map(props[key], value => ({ [key]: value })),
					) as any;
					const merged: HKT<M, Partial<P>> = array.reduce(inputs, M.zero(), (b, a) => M.alt(b, () => a));
					this.inputSubscription = M.subscribe(merged, this.setStateObserver);
				}
				if (effects$) {
					this.effectsSubscription = M.subscribe(effects$, voidObserver);
				}
			}

			componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any): void {
				this.adapter[0](nextProps);
			}

			componentWillMount(): void {
				this.inputSubscription && this.inputSubscription.unsubscribe();
				this.effectsSubscription && this.effectsSubscription.unsubscribe();
			}

			render() {
				return createElement(
					Target,
					Object.assign({}, this.selected.defaultProps, this.props, this.state || {}),
				);
			}
		}

		hoistNonReactStatics(WithObservable, Target);

		return WithObservable as any; //defaultProps are tracked by defaultProps argument;
	};
}
