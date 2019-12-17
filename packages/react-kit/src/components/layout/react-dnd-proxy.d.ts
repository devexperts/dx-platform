//DO NOT REMOVE THIS FILE
declare class HTML5Backend {
	constructor(manager: any);
	monitor: any;
	dragOverTargetIds: any[];

	isDraggingNativeItem(): boolean;

	handleTopDragOver(e: DragEvent): void;
	handleDragOver(e: DragEvent, targetId: any): void;

	checkIfCurrentDragSourceRectChanged(): boolean;
}

export { HTML5Backend };
