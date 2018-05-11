import { ComponentType } from 'react';
import {PartialKeys} from '@devexperts/utils/dist/object';

export type TWithDefaults = <Props extends object, DefaultProps extends keyof Props>(
    defaultProps: Pick<Props, DefaultProps>,
) => (TargetComponent: ComponentType<Props>) => ComponentType<PartialKeys<Props, DefaultProps>>;

export const withDefaults: TWithDefaults = defaults => targetComponent => {
    const defaultProps = (Object as any).assign({}, targetComponent.defaultProps || {}, defaults);

    targetComponent.defaultProps = defaultProps;

    return targetComponent as any;
};
