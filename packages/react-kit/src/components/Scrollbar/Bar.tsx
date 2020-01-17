import React from 'react';
import { PURE } from '../../utils/pure';
import { EventListener, TEventListenerProps } from '../EventListener/EventListener';
import { Omit } from 'typelevel-ts';

export type TBarProps = {
	onBarDragStart: React.MouseEventHandler<HTMLDivElement>;
	onBarDrag: React.MouseEventHandler<HTMLDivElement>;
	theme: {
		container?: string;
	};
};

export type TBarState = {
	isDragging: boolean;
};

@PURE
export class Bar extends React.Component<TBarProps, TBarState> {
	state = {
		isDragging: false,
	};

	render() {
		const { isDragging } = this.state;

		let eventListenerProps: Omit<TEventListenerProps, 'children'> = {
			target: 'window',
			capture: true,
		};

		if (isDragging) {
			eventListenerProps = {
				...eventListenerProps,
				onMouseUp: this.onDocumentMouseUp,
				onMouseMove: this.onDocumentMouseMove,
				onSelectStart: this.onDocumentSelectStart,
				onDragEnd: this.onDragEnd,
			};
		}

		const barProps = {
			onMouseDown: this.onBarMouseDown,
			onClick: this.onBarClick,
			className: this.props.theme.container,
		};

		return (
			<EventListener {...(eventListenerProps as TEventListenerProps)}>
				<div {...barProps} />
			</EventListener>
		);
	}

	onBarClick: React.MouseEventHandler<HTMLDivElement> = event => {
		event.stopPropagation();
	};

	onDocumentSelectStart: React.MouseEventHandler<HTMLDivElement> = event => {
		event.preventDefault();
		event.stopPropagation();
		return false;
	};

	onDocumentMouseMove: React.MouseEventHandler<HTMLDivElement> = event => {
		const { onBarDrag } = this.props;
		onBarDrag && onBarDrag(event);
	};

	onDragEnd: React.MouseEventHandler<HTMLDivElement> = event => {
		this._stopDrag(event);
	};

	onDocumentMouseUp: React.MouseEventHandler<HTMLDivElement> = event => {
		this._stopDrag(event);
	};

	_stopDrag: React.MouseEventHandler<HTMLDivElement> = event => {
		const { onBarDrag } = this.props;

		this.setState({
			isDragging: false,
		});

		onBarDrag && onBarDrag(event);
	};

	onBarMouseDown: React.MouseEventHandler<HTMLDivElement> = event => {
		const { onBarDragStart } = this.props;

		onBarDragStart && onBarDragStart(event);

		this.setState({
			isDragging: true,
		});
	};
}
