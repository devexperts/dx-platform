import { DISPOSABLE as fdisposable } from '@devexperts/utils/dist/function/disposable';

export function DISPOSABLE<T extends Function>(target: T): T {
	const disposable = fdisposable(target);
	//noinspection JSDuplicatedDeclaration
	const componentWillUnmount = disposable.prototype.componentWillUnmount;
	disposable.prototype.componentWillUnmount = function () {
		if (componentWillUnmount) {
			componentWillUnmount();
		}
		this.dispose();
	};
	return disposable;
}