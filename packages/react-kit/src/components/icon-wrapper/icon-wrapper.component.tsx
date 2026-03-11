import React from 'react';
import theme from './icon-wrapper.component.styl';

export const IconWrapper: React.FC<{ children?: React.ReactNode }> = props => (
	<i className={theme.container}>{props.children}</i>
);
