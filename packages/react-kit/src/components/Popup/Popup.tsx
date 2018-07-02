import * as React from 'react';
import { createPortal } from 'react-dom';
import { PURE } from '../../utils/pure';
import * as classnames from 'classnames';
import { Component, MouseEventHandler, ReactNode } from 'react';
import { ObjectClean } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { withTheme } from '../../utils/withTheme';
import { RootClose } from '../RootClose/RootClose';

export const POPUP = Symbol('Popup') as symbol;

export type TRawPopupProps = {
	theme: {
		container?: string;
		header?: string;
		body?: string;
		footer?: string;
		backdrop?: string;
		backdrop_isModal?: string;
		backdrop_closeOnClickAway?: string;
	};
	children: ReactNode;
	header?: ReactNode;
	footer?: ReactNode;

	isModal?: boolean;
	isOpened?: boolean;

	shouldCloseOnClickAway?: boolean;
	onRequestClose?: () => any;

	container?: Element;
};

@PURE
class RawPopup extends Component<TRawPopupProps> {
	private backdrop: Element | null;

	private rootElement: Element;

	constructor(props: TRawPopupProps) {
		super(props);

		this.rootElement = document.createElement('div');
		const container = props.container || document.body;
		container.appendChild(this.rootElement);
	}

	componentWillUnmount() {
		const container = this.props.container || document.body;
		container.removeChild(this.rootElement);
	}

	render() {
		const {
			theme,
			header,
			children,
			footer,
			isModal,
			isOpened,
			shouldCloseOnClickAway,
			onRequestClose,
		} = this.props;

		if (!isOpened) {
			return null;
		}

		const backdropClassName = classnames(theme.backdrop, {
			[theme.backdrop_isModal as string]: isModal,
			[theme.backdrop_closeOnClickAway as string]: shouldCloseOnClickAway,
		});

		const child = (
			<RootClose
				onRootClose={onRequestClose}
				ignoreKeyUp={!shouldCloseOnClickAway}
				ignoreClick={!shouldCloseOnClickAway || isModal}>
				<div className={backdropClassName} ref={el => (this.backdrop = el)} onClick={this.handleBackdropClick}>
					<div className={theme.container}>
						{header && <div className={theme.header}>{header}</div>}
						{<div className={theme.body}>{children}</div>}
						{footer && <div className={theme.footer}>{footer}</div>}
					</div>
				</div>
			</RootClose>
		);

		return createPortal(child, this.rootElement);
	}

	private handleBackdropClick: MouseEventHandler<HTMLElement> = e => {
		const { shouldCloseOnClickAway, onRequestClose } = this.props;
		if (shouldCloseOnClickAway && onRequestClose) {
			const { isModal } = this.props;
			if (isModal) {
				//popup is modal - backdrop handles clicks
				//don't process click inside popup container (bubbled events)
				if (e.target === this.backdrop) {
					onRequestClose();
				}
			}
			//if popup isn't modal then it's closed by RootClose
		}
		e.stopPropagation();
	};
}

export type TPopupProps = ObjectClean<PartialKeys<TRawPopupProps, 'theme'>>;
export const Popup = withTheme(POPUP)(RawPopup);
