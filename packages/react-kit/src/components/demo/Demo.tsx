import React from 'react';
import { themr, ThemeProvider as ThemrProvider } from 'react-css-themr';
import * as PropTypes from 'prop-types';
import { ThemeProvider, withTheme } from '../../utils/withTheme';

import css from './Demo.styl';

import theme from './theme';
import {ObjectClean} from 'typelevel-ts';
import {PartialKeys} from '@devexperts/utils/lib/object/object';

const DEMO = Symbol();

export type TFullDemoComponentProps = JSX.IntrinsicAttributes & {
	theme: {
		container?: string
	}
}

class RawDemoComponent extends React.Component<TFullDemoComponentProps> {
	render() {
		const { children, theme } = this.props;

		return (
			<section className={theme.container}>
				{children}
			</section>
		);
	}
}

export type TDemoComponentProps = ObjectClean<PartialKeys<TFullDemoComponentProps, 'theme'>>;
export const DemoComponent: React.ComponentClass<TDemoComponentProps> = withTheme(DEMO, css)(RawDemoComponent);

const Demo: React.SFC<Partial<TFullDemoComponentProps>> = props => (
	<ThemrProvider theme={theme}>
		<ThemeProvider theme={theme}>
			<DemoComponent theme={props.theme}>
				{props.children}
			</DemoComponent>
		</ThemeProvider>
	</ThemrProvider>
);

export default Demo;
export {
	Demo
};