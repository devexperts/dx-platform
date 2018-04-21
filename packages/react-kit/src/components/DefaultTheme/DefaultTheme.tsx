import './reset.styl';

import * as React from 'react';
import { ThemeProvider as ThemrProvider } from 'react-css-themr';
import { ThemeProvider } from '../../utils/withTheme';

import theme from './theme';

export const DefaultTheme: React.SFC<JSX.IntrinsicAttributes> = props => (
    <ThemrProvider theme={theme}>
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    </ThemrProvider>
);

