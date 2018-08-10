import { ComponentType } from 'react';
import { Omit } from 'typelevel-ts';

export function defaults<K extends keyof D, D extends {}>(defaults: D) {
	function decorate<P extends D>(Target: ComponentType<P & D>): ComponentType<Omit<P, K> & Partial<D>> {
		Target.defaultProps = defaults;
		return Target as any;
	}

	return decorate;
}
