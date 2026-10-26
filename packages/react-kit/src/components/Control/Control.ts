import React, { FC } from 'react';
import { ComponentClass } from 'react';
import { Omit } from 'typelevel-ts';

export enum Key {
	Escape = 'Escape',
	Left = 'ArrowLeft',
	Up = 'ArrowUp',
	Down = 'ArrowDown',
	Right = 'ArrowRight',
	Delete = 'Delete',
	Tab = 'Tab',
	Enter = 'Enter',
	Backspace = 'Backspace',
	N0 = '0',
	N1 = '1',
	N2 = '2',
	N3 = '3',
	N4 = '4',
	N5 = '5',
	N6 = '6',
	N7 = '7',
	N8 = '8',
	N9 = '9',
	NUM0 = '0',
	NUM1 = '1',
	NUM2 = '2',
	NUM3 = '3',
	NUM4 = '4',
	NUM5 = '5',
	NUM6 = '6',
	NUM7 = '7',
	NUM8 = '8',
	NUM9 = '9',
	LETR_A = 'a',
	LETR_P = 'p',
}

export const KEY_CODE_NUM_MAP: { [key: string]: number } = {
	[Key.N0]: 0,
	[Key.N1]: 1,
	[Key.N2]: 2,
	[Key.N3]: 3,
	[Key.N4]: 4,
	[Key.N5]: 5,
	[Key.N6]: 6,
	[Key.N7]: 7,
	[Key.N8]: 8,
	[Key.N9]: 9,
	[Key.NUM0]: 0,
	[Key.NUM1]: 1,
	[Key.NUM2]: 2,
	[Key.NUM3]: 3,
	[Key.NUM4]: 4,
	[Key.NUM5]: 5,
	[Key.NUM6]: 6,
	[Key.NUM7]: 7,
	[Key.NUM8]: 8,
	[Key.NUM9]: 9,
};

export const KEY_CODE_LETR_MAP: { [key: string]: string } = {
	[Key.LETR_A]: 'A',
	[Key.LETR_P]: 'P',
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
		Target: FC<P & TCP<V, N, H>> | CC<P & TCP<V, N, H>>,
	): TResult<P, V, N, D, H> {
		class Stateful extends React.Component<TStatefulProps<P, V, N, D, H>, TStatefulState<V>> {
			static displayName = `Stateful(${Target.displayName || Target.name || 'Component'})`;

			constructor(props: TStatefulProps<P, V, N, D, H>) {
				super(props);
				this.state = {
					value: props[defaultValueName],
				};
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
