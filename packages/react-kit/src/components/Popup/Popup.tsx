import * as React from 'react';
import { PURE } from '../../utils/pure';
import * as classnames from 'classnames';
import * as Portal from 'react-overlays/lib/Portal';
import * as PropTypes from 'prop-types';
import { Component, MouseEventHandler, ReactNode } from 'react';
import { ObjectClean } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { withTheme } from '../../utils/withTheme';
import { RootClose } from '../RootClose/RootClose';

export const POPUP = Symbol('Popup');

export type TRawPopupProps = {
	theme: {
		container?: string,
		header?: string,
		body?: string,
		footer?: string,
		backdrop?: string,
		backdrop_isModal?: string,
		backdrop_closeOnClickAway?: string,
	},
	children: ReactNode,
	header?: ReactNode,
	footer?: ReactNode,

	isModal?: boolean,
	isOpened?: boolean,

	shouldCloseOnClickAway?: boolean,
	onRequestClose?: () => any,

	container: ReactOverlays.Portal.TPortalProps['container']
};

export const POPUP_THEME_SHAPE_OBJECT = {
	container: PropTypes.string,
	header: PropTypes.string,
	body: PropTypes.string,
	footer: PropTypes.string
};

@PURE
class RawPopup extends Component<TRawPopupProps> {
	private backdrop: Element | null;

	render() {
		const {
			theme,
			header,
			children,
			footer,
			isModal,
			container,
			isOpened,
			shouldCloseOnClickAway,
			onRequestClose
		} = this.props;

		if (!isOpened) {
			return null;
		}

		const backdropClassName = classnames(
			theme.backdrop,
			{
				[theme.backdrop_isModal as string]: isModal,
				[theme.backdrop_closeOnClickAway as string]: shouldCloseOnClickAway
			}
		);

		let child = (
			<RootClose onRootClose={onRequestClose}
			           ignoreKeyUp={!shouldCloseOnClickAway}
			           ignoreClick={!shouldCloseOnClickAway || isModal}>
				<div className={backdropClassName}
				     ref={el => this.backdrop = el}
				     onClick={this.handleBackdropClick}>
					<div className={theme.container}>
						{header && <div className={theme.header}>{header}</div>}
						{<div className={theme.body}>{children}</div>}
						{footer && <div className={theme.footer}>{footer}</div>}
					</div>
				</div>
			</RootClose>
		);

		// //if popup is modal then it should be closed only on click on backdrop
		// //if popup isn't modal then backdrop has pointer-events: none and click should be detected by RootClose
		// if (shouldCloseOnClickAway) {
		// 	child = (
		// 		<RootClose ignoreClick={isModal}>
		// 			{child}
		// 		</RootClose>
		// 	);
		// }

		child = (
			<Portal container={container}>
				{child}
			</Portal>
		);

		return child;
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
	}
}

export type TPopupProps = ObjectClean<PartialKeys<TRawPopupProps, 'theme'>>;
export const Popup = withTheme(POPUP)(RawPopup);