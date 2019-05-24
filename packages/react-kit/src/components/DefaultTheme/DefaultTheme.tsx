import './reset.styl';

import * as React from 'react';
import { ThemeProvider } from '../../utils/withTheme';

import theme from './theme';

export const DefaultTheme: React.SFC<JSX.IntrinsicAttributes> = props => (
	<ThemeProvider theme={theme}>{props.children}</ThemeProvider>
);
