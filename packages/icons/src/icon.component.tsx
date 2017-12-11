import * as React from 'react';
import classname from 'classnames';
import * as css from './icon.component.styl';

export type TBaseIconProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
export const Icon: React.SFC<TBaseIconProps> = (props) => (
    <i {...props} className={classname(css.container, props.className)}/>
);