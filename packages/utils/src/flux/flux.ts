/**
 * @template TFSActionPayload
 */
function TFSAction() { //eslint-disable-line no-empty-function
}
/**
 * @type {string|String}
 */
TFSAction.prototype.type = '';
/**
 * @type {TFSActionPayload}
 */
TFSAction.prototype.payload = null;

/**
 * @type {*}
 */
TFSAction.prototype.error = null;

/**
 * @typedef {Object} TFSAction
 */

/**
 * @typedef {TFSAction|TThunkAction} TThunkActionResult
 */

/**
 * @typedef {function(action:TThunkActionResult):void} TThunkActionDispatch
 */

/**
 * @typedef {function(dispatch:TThunkActionDispatch, getState:function():*):TThunkActionResult} TThunkAction
 */

export {TFSAction};