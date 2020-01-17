import React from 'react';
import { Component, KeyboardEventHandler, MouseEvent, MouseEventHandler, ReactElement, TouchEventHandler } from 'react';
import { EventListener } from '../EventListener/EventListener';
import { findDOMNode } from 'react-dom';
import { KeyCode } from '../Control/Control';
import { PURE } from '../../utils/pure';

//inspired by https://github.com/react-bootstrap/react-overlays/blob/master/src/RootCloseWrapper.js

export type TRootCloseProps = {
	children: ReactElement<any>;
	onRootClose?: () => any;
	ignoreClick?: boolean;
	ignoreKeyUp?: boolean;
};

@PURE
export class RootClose extends Component<TRootCloseProps> {
	private preventMouseRootClose = false;
	private ignoreMouseUp = true;

	render() {
		return (
			<EventListener
				target={document}
				onMouseDown={this.onMouseDown}
				onClick={this.handleClick}
				onClickCapture={this.handleClickCapture}
				onTouchStart={this.handleTouchStart}
				onTouchStartCapture={this.handleTouchStartCapture}
				onKeyUp={this.handleKeyUp}>
				{this.props.children}
			</EventListener>
		);
	}

	private onMouseDown = () => {
		this.ignoreMouseUp = false;
	};

	private handleClickCapture: MouseEventHandler<HTMLElement> = e => {
		const domNode = findDOMNode(this);
		if (!domNode) {
			return;
		}
		this.preventMouseRootClose =
			this.ignoreMouseUp || isModifiedEvent(e) || !isLeftClickEvent(e) || domNode.contains(e.target as Node);
	};

	private handleClick: MouseEventHandler<HTMLElement> = e => {
		if (!this.props.ignoreClick && !this.preventMouseRootClose && this.props.onRootClose) {
			this.props.onRootClose();
		}
	};

	private handleTouchStartCapture: TouchEventHandler<HTMLElement> = e => {
		const domNode = findDOMNode(this);
		if (!domNode) {
			return;
		}
		this.preventMouseRootClose = domNode.contains(e.target as Node);
	};

	private handleTouchStart: TouchEventHandler<HTMLElement> = () => {
		if (!this.props.ignoreClick && !this.preventMouseRootClose && this.props.onRootClose) {
			this.props.onRootClose();
		}
	};

	private handleKeyUp: KeyboardEventHandler<HTMLElement> = e => {
		if (!this.props.ignoreKeyUp && e.keyCode === KeyCode.Escape && this.props.onRootClose) {
			this.props.onRootClose();
		}
	};
}

function isLeftClickEvent(event: MouseEvent<HTMLElement>): boolean {
	return event.button === 0;
}

function isModifiedEvent(event: MouseEvent<HTMLElement>): boolean {
	return Boolean(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
