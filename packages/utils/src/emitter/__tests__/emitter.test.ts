import Emitter from '../Emitter';

describe('Emitter', () => {
	const event = 'fire';
	let callback: any;
	let emitter: any;

	beforeEach(() => {
		callback = jest.fn();
		emitter = new class extends Emitter {
			fire() {
				this._emit(event);
			}
		}();
	});

	it('should fire event', () => {
		emitter.on(event, callback);
		expect(callback).not.toBeCalled();

		emitter.fire();
		expect(callback).toBeCalled();
		expect(callback.mock.calls.length).toBe(1);
	});

	it('should unbind event handler', () => {
		emitter.on(event, callback);
		emitter.fire();
		emitter.off(event);
		emitter.fire();

		expect(callback.mock.calls.length).toBe(1);

		const unsubscribe = emitter.on(event, callback);
		emitter.fire();
		unsubscribe();
		emitter.fire();
		expect(callback.mock.calls.length).toBe(2);
	});
});