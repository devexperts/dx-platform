import * as React from 'react';
import * as theme from './icon-wrapper.component.styl';

export const IconWrapper: React.SFC<JSX.IntrinsicAttributes> = props => (
	<i className={theme.container}>{props.children}</i>
);
