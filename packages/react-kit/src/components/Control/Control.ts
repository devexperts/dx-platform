import React from 'react';
import { ComponentClass } from 'react';
import { Omit } from 'typelevel-ts';
import SFC = React.SFC;

export enum KeyCode {
	Escape = 27,
	Left = 37,
	Up = 38,
	Down = 40,
	Right = 39,
	Delete = 46,
	Tab = 9,
	Enter = 13,
	Backspace = 8,
	N0 = 48,
	N1 = 49,
	N2 = 50,
	N3 = 51,
	N4 = 52,
	N5 = 53,
	N6 = 54,
	N7 = 55,
	N8 = 56,
	N9 = 57,
	NUM0 = 96,
	NUM1 = 97,
	NUM2 = 98,
	NUM3 = 99,
	NUM4 = 100,
	NUM5 = 101,
	NUM6 = 102,
	NUM7 = 103,
	NUM8 = 104,
	NUM9 = 105,
	LETR_A = 65,
	LETR_P = 80,
}

export const KEY_CODE_NUM_MAP: { [code: number]: number } = {
	[KeyCode.N0]: 0,
	[KeyCode.N1]: 1,
	[KeyCode.N2]: 2,
	[KeyCode.N3]: 3,
	[KeyCode.N4]: 4,
	[KeyCode.N5]: 5,
	[KeyCode.N6]: 6,
	[KeyCode.N7]: 7,
	[KeyCode.N8]: 8,
	[KeyCode.N9]: 9,
	[KeyCode.NUM0]: 0,
	[KeyCode.NUM1]: 1,
	[KeyCode.NUM2]: 2,
	[KeyCode.NUM3]: 3,
	[KeyCode.NUM4]: 4,
	[KeyCode.NUM5]: 5,
	[KeyCode.NUM6]: 6,
	[KeyCode.NUM7]: 7,
	[KeyCode.NUM8]: 8,
	[KeyCode.NUM9]: 9,
};

export const KEY_CODE_LETR_MAP: { [code: number]: string } = {
	[KeyCode.LETR_A]: 'A',
	[KeyCode.LETR_P]: 'P',
};

//tslint:disable max-line-length

//here are some abbreviations to be short
//V - TValue (value type)
//N - value prop name (string, default: 'value')
//D - default value prop name (string, default: 'defaultValue')
//H - change handler prop name (string, default: 'onValueChange')

/**
 * state of HOC - no need to mess with value naming - let it just be a 'value'
 */
export type TStatefulState<V> = {
	value?: V;
};

//first part of props with constraint that props should contain a field with name N (value name) and type V (value type)
export type TDynamicValue<V, N extends string> = { [value in N]: V };
//seconds part of props with constraint that props should contain a field with name H (change handler name) and type H (change handler type)
export type TDynamicValueHandler<V, H extends string> = { [handler in H]: (value: V) => void };
//union of props
export type TControlProps<V, N extends string = 'value', H extends string = 'onValueChange'> = TDynamicValue<V, N> &
	TDynamicValueHandler<V, H>;

//resulting HOC props
export type TStatefulProps<
	P extends TControlProps<V, N, H>,
	V,
	N extends string = 'value',
	D extends string = 'defaultValue',
	H extends string = 'onValueChange'
> = Omit<P, N | H> & //remove both value name and handler name from props
	Partial<TDynamicValueHandler<V, H>> & //add optional change handler to props
	TDynamicValue<V, D>; //add default value name to props - pass D (defaultValue name) here instead of N (value name)

//this will the type of resulting HOC
type TResult<
	P extends TControlProps<V, N, H>,
	V,
	N extends string = 'value',
	D extends string = 'defaultValue',
	H extends string = 'onValueChange'
> = CC<TStatefulProps<P, V, N, D, H>>;

//some shortcuts to be even shorter
type TCP<V, VN extends string, HN extends string> = TControlProps<V, VN, HN>;
type CC<P> = ComponentClass<P>;

export function stateful<
	N extends string = 'value',
	D extends string = 'defaultValue',
	H extends string = 'onValueChange'
>(valueName: N = 'value' as any, handlerName: H = 'onValueChange' as any, defaultValueName: D = 'defaultValue' as any) {
	return function decorate<V, P extends TCP<V, N, H>>(
		Target: SFC<P & TCP<V, N, H>> | CC<P & TCP<V, N, H>>,
	): TResult<P, V, N, D, H> {
		class Stateful extends React.Component<TStatefulProps<P, V, N, D, H>, TStatefulState<V>> {
			static displayName = `Stateful(${Target.displayName || Target.name || 'Component'})`;

			componentWillMount() {
				this.setState({
					value: this.props[defaultValueName] as any,
				});
			}

			render() {
				const props = Object.assign({}, this.props, {
					[valueName as string]: this.state.value,
					[handlerName as string]: this.onValueChange,
				});
				//tslint:disable-next-line no-any - fix for react typings
				return React.createElement(Target as any, props);
			}

			protected onValueChange = (value: V): void => {
				this.setState({
					value,
				});
				const onValueChange: (value: V) => void = this.props[handlerName] as any;
				onValueChange && onValueChange(value);
			};
		}

		return Stateful;
	};
}

//tslint:enable max-line-length
