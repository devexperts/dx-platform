import { uuid } from '../string/string';
import { DISPOSABLE } from '../function/disposable';
import Emitter from '../emitter/Emitter';

const id = uuid();
const EVENT_KEY = '__SESSION_EVENT__';

/**
 * @enum
 */
export const E_SESSION = {
	REQUEST: 'E_SESSION:REQUEST'
};

/**
 * @typedef {{}} TRequestData
 * @property {String} receiver_sid
 * @property {*} messageType
 * @property {*} payload
 */

/**
 * @emits {@link E_SESSION}
 */
@DISPOSABLE
export class Session extends Emitter {
	/**
	 * Current session id
	 * @returns {String}
	 */
	get id() {
		return id;
	}

	constructor() {
		super();
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', this._onStorage);
			this['_using']([
				() => window.removeEventListener('storage', this._onStorage)
			]);
		}
	}

	/**
	 * Sends message to another session by id
	 * @param {String} sid
	 * @param {*} messageType
	 * @param {*} payload
	 */
	send(sid: string, messageType: any, payload: any) {
		const data = JSON.stringify({
			receiver_sid: sid,
			messageType,
			payload
		});
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(EVENT_KEY, data);
		}
	}

	/**
	 * @param {Event} event
	 * @private
	 */
	_onStorage = (event: StorageEvent) => {
		if (event.key === EVENT_KEY) {
			/**
			 * @type {TRequestData}
			 */
			let value;
			try {
				if (event.newValue) {
					value = JSON.parse(event.newValue);
				}
			} catch (e) {
			}
			if (value && value.receiver_sid === id) {
				this._emit(E_SESSION.REQUEST, value.messageType, value.payload);
				this._emit(value.messageType, value.payload);
			}
		}
	}
}

export default new Session();