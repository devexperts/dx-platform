import { ComponentType } from 'react';
import { PartialKeys } from '@devexperts/utils/dist/object/object';

export const withDefaults = <P extends object, Keys extends keyof P>(
	defaults: Pick<P, Keys>,
): ((Target: ComponentType<P>) => ComponentType<PartialKeys<P, Keys>>) => Target => {
	Target.defaultProps = Object.assign({}, Target.defaultProps || {}, defaults); // tslint:disable-line
	return Target as any; // tslint:disable-line
};
