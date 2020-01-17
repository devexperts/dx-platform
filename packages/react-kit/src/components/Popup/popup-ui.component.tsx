import React from 'react';
import { PURE } from '../../utils/pure';
import classnames from 'classnames';
import { Component, MouseEventHandler, ReactNode } from 'react';
import { ReactRef } from '../../utils/typings';

export type TRawPopupUIProps = {
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
	shouldCloseOnClickAway?: boolean;
};

export type TRawPopupUIFullProps = TRawPopupUIProps & {
	innerRef?: (instance: ReactRef) => void;
	onBackdropClick: MouseEventHandler<HTMLElement>;
};

@PURE
export class PopupUI extends Component<TRawPopupUIFullProps> {
	render() {
		const { theme, header, children, footer, isModal, shouldCloseOnClickAway } = this.props;

		const backdropClassName = classnames(theme.backdrop, {
			[theme.backdrop_isModal as string]: isModal,
			[theme.backdrop_closeOnClickAway as string]: shouldCloseOnClickAway,
		});

		return (
			<div className={backdropClassName} ref={this.getRef} onClick={this.handleBackdropClick}>
				<div className={theme.container}>
					{header && <div className={theme.header}>{header}</div>}
					{<div className={theme.body}>{children}</div>}
					{footer && <div className={theme.footer}>{footer}</div>}
				</div>
			</div>
		);
	}

	private getRef = (backdrop: ReactRef<HTMLElement>): void => {
		const { innerRef } = this.props;

		if (innerRef) {
			innerRef(backdrop);
		}
	};

	private handleBackdropClick: MouseEventHandler<HTMLElement> = e => {
		e.stopPropagation();
		this.props.onBackdropClick(e);
	};
}
