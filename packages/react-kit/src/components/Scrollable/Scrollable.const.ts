import Emitter from '@devexperts/platform-utils/dist/emitter/Emitter';
import { createContext } from 'react';

export const EVENT_SCROLABLE = {
	RESIZE: 'EVENT_SCROLABLE:RESIZE',
	SCROLL: 'EVENT_SCROLLABLE:SROLL',
	SCROLLBAR_UPDATE: 'EVENT_SCROLABLE:SCROLLBAR_UPDATE',
};

export class ScrollableInternalEmitter extends Emitter {
	emit(event: any, ...args: any[]) {
		this._emit(event, ...args);
	}
}

export const SCROLLABLE_CONTEXT_EMITTER = '__SCROLLABLE__CONTEXT_EMITTER__';
type ScrollableContextProperties = {
	size: {
		width: number;
		height: number;
	};
	[SCROLLABLE_CONTEXT_EMITTER]: ScrollableInternalEmitter;
};
export const ScrollableContext = createContext<ScrollableContextProperties>({
	[SCROLLABLE_CONTEXT_EMITTER]: new ScrollableInternalEmitter(),
	size: { width: 0, height: 0 },
});
