import React from 'react';
import prefix from '@devexperts/utils/dist/dom/prefix';
import { DraggableCore, DraggableEventHandler } from 'react-draggable';
import { LAYOUT_THEME, LayoutOrientation } from './layout.constants';
import { PURE } from '../../utils/pure';
import { withDefaults } from '../../utils/with-defaults';

export type TResizeHandlerProps = {
	onDrag?: DraggableEventHandler;
	onDragStart?: (previousId: string, nextId: string, e: any, data: any) => void;
	onDragStop?: DraggableEventHandler;
	onMouseDown?: (e: Event) => void;
	theme: LAYOUT_THEME;
	size: number;
	previousId: string;
	nextId: string;
	offset: number;
	isFixed?: boolean;
	orientation: LayoutOrientation;
};

@PURE
class RawResizeHandler extends React.Component<TResizeHandlerProps> {
	static defaultProps = {
		offset: 0,
		theme: {},
	};

	render() {
		const { theme, onDrag, onDragStop, onMouseDown, offset, size, isFixed, orientation } = this.props;
		const style = getSizeStyle(orientation, offset, size);

		if (isFixed) {
			return <div style={style} className={`${theme.resizeHandler} ${theme.resizeHandler_disabled}`} />;
		}

		return (
			<DraggableCore
				enableUserSelectHack={false}
				onMouseDown={onMouseDown}
				onDrag={onDrag}
				onStart={this.onDragStart}
				onStop={onDragStop}>
				<div style={style} className={theme.resizeHandler} />
			</DraggableCore>
		);
	}

	onDragStart = (e: any, data: any) => {
		const { onDragStart } = this.props;

		if (onDragStart) {
			const { previousId, nextId } = this.props;
			onDragStart(previousId, nextId, e, data);
		}
	};
}

function getSizeStyle(orientation: LayoutOrientation, offset: number, size: number | string): object {
	switch (orientation) {
		case LayoutOrientation.Horizontal: {
			return {
				...prefix({
					transform: `translateX(${offset}px)`,
				}),
				width: size,
			};
		}
		case LayoutOrientation.Vertical: {
			return {
				...prefix({
					transform: `translateY(${offset}px)`,
				}),
				height: size,
			};
		}
	}
}

export const ResizeHandler = withDefaults<TResizeHandlerProps, 'offset' | 'theme'>({
	offset: 0,
	theme: {},
})(RawResizeHandler);
