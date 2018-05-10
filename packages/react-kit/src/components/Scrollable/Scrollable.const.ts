import Emitter from '@devexperts/utils/dist/emitter/Emitter';
import * as PropTypes from 'prop-types';

export const EVENT_SCROLABLE = {
	RESIZE: 'EVENT_SCROLABLE:RESIZE',
	SCROLL: 'EVENT_SCROLLABLE:SROLL',
	SCROLLBAR_UPDATE: 'EVENT_SCROLABLE:SCROLLBAR_UPDATE'
};

export class ScrollableInternalEmitter extends Emitter {
	emit(event: any, ...args: any[]) {
		this._emit(event, ...args);
	}
}

export const SCROLLABLE_CONTEXT_EMITTER = '__SCROLLABLE__CONTEXT_EMITTER__';
export const CONTEXT_TYPES = {
	[SCROLLABLE_CONTEXT_EMITTER.toString()]: PropTypes.instanceOf(ScrollableInternalEmitter).isRequired,
	size: PropTypes.shape({
		width: PropTypes.number,
		height: PropTypes.number
	})
};