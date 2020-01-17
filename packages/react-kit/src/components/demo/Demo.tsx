import React from 'react';
import { withTheme } from '../../utils/withTheme';

import { DefaultTheme } from '../DefaultTheme/DefaultTheme';

import css from './Demo.styl';

import { PartialKeys } from '@devexperts/utils/dist/object/object';

const DEMO = Symbol();

export type TFullDemoComponentProps = JSX.IntrinsicAttributes & {
	theme: {
		container?: string;
	};
};

class RawDemoComponent extends React.Component<TFullDemoComponentProps> {
	render() {
		const { children, theme } = this.props;

		return <section className={theme.container}>{children}</section>;
	}
}

export type TDemoComponentProps = PartialKeys<TFullDemoComponentProps, 'theme'>;
export const DemoComponent: React.ComponentClass<TDemoComponentProps> = withTheme(DEMO, css)(RawDemoComponent);

const Demo: React.SFC<Partial<TFullDemoComponentProps>> = props => (
	<DefaultTheme>
		<DemoComponent theme={props.theme}>{props.children}</DemoComponent>
	</DefaultTheme>
);

export default Demo;
export { Demo };
