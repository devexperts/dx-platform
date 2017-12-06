export type IEmitterEvents<F extends Function = Function> = {
	[key: string]: F[]
};

/**
 * Basic event emitter
 */
export default class Emitter {
	private _events: IEmitterEvents = {};

	/**
	 * Binds handler to specified event
	 */
	on<H extends Function>(event: string, handler: H): () => void {
		if (this._events[event]) {
			this._events[event].push(handler);
		} else {
			this._events[event] = [handler];
		}
		return this.off.bind(this, event, handler);
	}

	/**
	 * Unbinds handler from specified event. If handler is not specified, all callbacks are unbound.
	 */
	off<H extends Function>(event: string, handler: H): void {
		if (handler) {
			const handlers = this._events[event];
			if (handlers) {
				const index = handlers.indexOf(handler);
				if (index !== -1) {
					if (handlers.length === 1) {
						delete this._events[event];
					} else {
						handlers.splice(index, 1);
					}
				}
			}
		} else {
			delete this._events[event];
		}
	}

	/**
	 * Emits event
	 */
	protected _emit(event: string, ...args: any[]) {
		if (this._events[event]) {
			this._events[event].forEach(handler => handler.apply(this, args));
		}
	}
}