declare module 'react-dnd-html5-backend' {
	export namespace NativeTypes {
		const FILE: string;
		const URL: string;
		const TEXT: string;
	}
}

declare module 'react-dnd-html5-backend/src/HTML5Backend' {
	export default class HTML5Backend {
		isDraggingNativeItem: () => boolean;
	}
}
