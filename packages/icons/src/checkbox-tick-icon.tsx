import * as React from 'react';
import {TBaseIconProps, Icon} from './icon.component'

export const CheckboxTickIcon: React.SFC<TBaseIconProps> = (props) => (
    <Icon {...props}>
        <svg viewBox="0 0 10 8">
            <polygon points="3.43 7.22 0.65 4.44 1.35 3.73 3.43 5.81 8.5 0.75 9.2 1.45 3.43 7.22"/>
        </svg>
    </Icon>
);