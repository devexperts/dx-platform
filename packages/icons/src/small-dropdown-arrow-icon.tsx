import * as React from 'react';
import {TBaseIconProps, Icon} from './icon.component'

export const SmallDropDownArrowIcon: React.SFC<TBaseIconProps> = (props) => (
    <Icon {...props}>
        <svg viewBox="0 0 512 512">
            <polygon points="0,111 254.9,402 512,111 "/>
        </svg>
    </Icon>
);