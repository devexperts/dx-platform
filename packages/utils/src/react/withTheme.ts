import {
    Children, createElement, ComponentClass, Component, SFC, Ref, StatelessComponent, ReactElement,
    ComponentType
} from 'react';
import * as PropTypes from 'prop-types';
import { ObjectOmit } from 'typelevel-ts';
import {PartialKeys} from '../object/object';

const THEME_CONTEXT_KEY = '@@dx-util/withTheme-context-key'; //should be serializable
const THEME_CONFIG_KEY = '@@dx-util/withTheme-config-key';

export type TTheme = {
	[key: string]: TTheme | string | undefined
};

type TWithConfig = {
	config?: {
		name: string,
		theme: TTheme
	}
};

type TTargetProps = {
	theme?: TTheme
};

type TResultProps<P extends TTargetProps> = ObjectOmit<P, 'theme'> & {
	theme?: P['theme']
};

type TWithRef<P extends TTargetProps, C> = TResultProps<P> & {
	withRef?: Ref<C>
};


type WithRef<P extends TTargetProps, C extends ComponentType<P>> = P & {
	withRef?: Ref<C>
}
type OmitTheme<P extends TTargetProps> = PartialKeys<P, 'theme'>;
type TResult<P extends TTargetProps, C extends ComponentType<P>> = ComponentClass<OmitTheme<WithRef<P, C>>>;

//shortcuts
type CC<P> = ComponentClass<P>;
type CT<P> = ComponentType<P>;

export const withTheme = (name: string | symbol, defaultTheme: TTheme = {}) => {
	function decorate<P extends TTargetProps>(Target: CT<P>): TResult<P, CT<P>> {

		if (Target['config'] && Target['config'].name === name) {
			//already wrapped - just merge in new defaultTheme
			Target['config'].theme = mergeTwo(Target['config'].theme, defaultTheme);
			return Target as any;
		}

		// noinspection UnnecessaryLocalVariableJS
		const config = {
			name,
			theme: defaultTheme
		};

		class Themed extends Component<TWithRef<P, ComponentClass<TResultProps<P>>>, never> {
			static displayName = `Themed(${Target.displayName || Target.name})`;

			static contextTypes = {
				[THEME_CONTEXT_KEY.toString()]: PropTypes.object.isRequired,
				//legacy react-css-themr context for backward compatibility
				themr: PropTypes.shape({
                    theme: PropTypes.object.isRequired
                })
			};

			render() {
				const themr = this.context.themr && this.context.themr.theme && this.context.themr.theme[name];
				const { withRef, theme, ...rest } = this.props;
				const props = {
					...rest,
					ref: withRef,
					theme: mergeThemes(
						config.theme,
						themr,
						this.context[THEME_CONTEXT_KEY.toString()][name],
						(theme || {}) as TTheme
					)
				};
				return createElement(Target as any, props);
			}
		}

		Themed[THEME_CONFIG_KEY] = config;

		return Themed;
	}

	return decorate;
}

/**
 * Merges passed themes by concatenating string keys and processing nested themes
 */
export function mergeThemes(...themes: TTheme[]): TTheme {
	return themes.reduce((acc, theme) => mergeTwo(acc, theme), {});
}

function mergeTwo(original: TTheme = {}, mixin: TTheme = {}): TTheme {
	//make a copy to avoid mutations of nested objects
	//also strip all functions injected by isomorphic-style-loader
	const result = Object.keys(original).reduce((acc, key) => {
		const value = original[key];
		if (typeof value !== 'function') {
			acc[key] = value;
		}
		return acc;
	}, {});

	//traverse mixin keys and merge them to resulting theme
	Object.keys(mixin).forEach(key => {
		//there's no need to set any defaults here
		const originalValue = result[key];
		const mixinValue = mixin[key];

		switch (typeof mixinValue) {
			case 'object': {
				//possibly nested theme object
				switch (typeof originalValue) {
					case 'object': {
						//exactly nested theme object - go recursive
						result[key] = mergeThemes(originalValue, mixinValue as TTheme);
						break;
					}

					case 'undefined': {
						//original does not contain this nested key - just take it as is
						result[key] = mixinValue;
						break;
					}

					default: {
						//can't merge an object with a non-object
						throw new Error(`You are merging object ${key} with a non-object ${originalValue}`);
					}
				}
				break;
			}

			case 'undefined': //fallthrough - handles accidentally unset values which may come from props
			case 'function': {
				//this handles issue when isomorphic-style-loader addes helper functions to css-module
				break; //just skip
			}

			default: {
				//plain values
				switch (typeof originalValue) {
					case 'object': {
						//can't merge a non-object with an object
						throw new Error(`You are merging non-object ${mixinValue} with an object ${key}`);
					}

					case 'undefined': {
						//mixin key is new to original theme - take it as is
						result[key] = mixinValue;
						break;
					}
					case 'function': {
						//this handles issue when isomorphic-style-loader addes helper functions to css-module
						break; //just skip
					}

					default: {
						//finally we can merge
						result[key] = (originalValue as string).split(' ')
							.concat((mixinValue as string).split(' '))
							.filter((item, pos, self) => self.indexOf(item) === pos && item !== '')
							.join(' ');
						break;
					}
				}
				break;
			}
		}
	});

	return result;
}

export type TThemeProviderProps = {
	theme: {
		[key: number]: TTheme
	}
};

export class ThemeProvider extends Component<TThemeProviderProps> {
	static childContextTypes = {
		[THEME_CONTEXT_KEY.toString()]: PropTypes.object
	};

	render() {
		return Children.only(this.props.children);
	}

	getChildContext() {
		return {
			[THEME_CONTEXT_KEY.toString()]: this.props.theme
		};
	}
}