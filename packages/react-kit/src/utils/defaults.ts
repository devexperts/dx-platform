import { ComponentType } from 'react';
import { ObjectOmit } from 'typelevel-ts';

export function defaults<K extends keyof D, D extends {}>(defaults: D) {
	function decorate<P extends D>(Target: ComponentType<P & D>): ComponentType<ObjectOmit<P, K> & Partial<D>> {
		Target.defaultProps = defaults;
		return Target as any;
	}

	return decorate;
}