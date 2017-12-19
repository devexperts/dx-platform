import './reset.styl';

import React from 'react';
import { ThemeProvider as ThemrProvider } from 'react-css-themr';
import { ThemeProvider } from '../../utils/withTheme';

import theme from './theme';

const DEMO = Symbol();

export const DefaultTheme: React.SFC<JSX.IntrinsicAttributes> = props => (
    <ThemrProvider theme={theme}>
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    </ThemrProvider>
);

