declare module 'react-draggable' {
	import * as React from 'react';

	export interface DraggableData {
		node: HTMLElement;
		x: number;
		y: number;
		deltaX: number;
		deltaY: number;
		lastX: number;
		lastY: number;
	}

	export type DraggableEvent =
		| React.MouseEvent<HTMLElement | SVGElement>
		| React.TouchEvent<HTMLElement | SVGElement>
		| MouseEvent
		| TouchEvent;

	export type DraggableEventHandler = (e: DraggableEvent, data: DraggableData) => void | false;

	export interface DraggableProps {
		axis?: 'both' | 'x' | 'y' | 'none';
		bounds?: { left?: number; top?: number; right?: number; bottom?: number } | string | false;
		defaultClassName?: string;
		defaultClassNameDragging?: string;
		defaultClassNameDragged?: string;
		defaultPosition?: { x: number; y: number };
		positionOffset?: { x: number | string; y: number | string };
		position?: { x: number; y: number };
		enableUserSelectHack?: boolean;
		onStart?: DraggableEventHandler;
		onDrag?: DraggableEventHandler;
		onStop?: DraggableEventHandler;
		onMouseDown?: (e: MouseEvent) => void;
		scale?: number;
		children?: React.ReactNode;
		disabled?: boolean;
		allowAnyClick?: boolean;
		cancel?: string;
		handle?: string;
		grid?: [number, number];
		offsetParent?: HTMLElement;
		nodeRef?: React.RefObject<HTMLElement>;
	}

	export interface DraggableCoreProps {
		allowAnyClick?: boolean;
		cancel?: string;
		children?: React.ReactNode;
		disabled?: boolean;
		enableUserSelectHack?: boolean;
		offsetParent?: HTMLElement;
		grid?: [number, number];
		handle?: string;
		onStart?: DraggableEventHandler;
		onDrag?: DraggableEventHandler;
		onStop?: DraggableEventHandler;
		onMouseDown?: (e: MouseEvent) => void;
		scale?: number;
		nodeRef?: React.RefObject<HTMLElement>;
	}

	export class DraggableCore extends React.Component<DraggableCoreProps> {}
	export default class Draggable extends React.Component<DraggableProps> {}
}
