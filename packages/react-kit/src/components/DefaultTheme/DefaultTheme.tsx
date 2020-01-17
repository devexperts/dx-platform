import './reset.styl';

import React from 'react';
import { ThemeProvider } from '../../utils/withTheme';

import theme from './theme';

export const DefaultTheme: React.SFC<JSX.IntrinsicAttributes> = props => (
	<ThemeProvider theme={theme}>{props.children}</ThemeProvider>
);
