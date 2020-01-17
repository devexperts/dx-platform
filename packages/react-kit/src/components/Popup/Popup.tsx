import React from 'react';
import { createPortal } from 'react-dom';
import { PURE } from '../../utils/pure';
import { Component, MouseEventHandler } from 'react';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { withTheme } from '../../utils/withTheme';
import { RootClose } from '../RootClose/RootClose';
import { PopupUI, TRawPopupUIFullProps, TRawPopupUIProps } from './popup-ui.component';
import { ComponentClass } from 'react';
import { ReactRef } from '../../utils/typings';
import { withDefaults } from '../../utils/with-defaults';

export const POPUP = Symbol('Popup') as symbol;

export type TFullPopupProps = TRawPopupUIProps & {
	onRequestClose?: () => any;
	PopupUI: ComponentClass<TRawPopupUIFullProps>;
	container?: Element;
	isOpened?: boolean;
};

@PURE
class RawPopup extends Component<TFullPopupProps> {
	private backdrop: ReactRef<HTMLElement> = null;

	private rootElement: Element;

	constructor(props: TFullPopupProps) {
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
			PopupUI,
			isOpened,
			shouldCloseOnClickAway,
			onRequestClose,
		} = this.props;

		if (!isOpened) {
			return null;
		}

		const child = (
			<RootClose
				onRootClose={onRequestClose}
				ignoreKeyUp={!shouldCloseOnClickAway}
				ignoreClick={!shouldCloseOnClickAway || isModal}>
				<PopupUI
					theme={theme}
					isModal={isModal}
					header={header}
					innerRef={this.innerRef}
					footer={footer}
					onBackdropClick={this.handleBackdropClick}>
					{children}
				</PopupUI>
			</RootClose>
		);

		return createPortal(child, this.rootElement);
	}

	private innerRef = (backdrop: ReactRef<HTMLElement>) => {
		this.backdrop = backdrop;
	};

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
	};
}

export type TPopupProps = PartialKeys<TFullPopupProps, 'theme' | 'PopupUI'>;
type Defaults = 'PopupUI';
const defaults = withDefaults<TFullPopupProps, Defaults>({
	PopupUI,
});
export const Popup: ComponentClass<TPopupProps> = withTheme(POPUP)(defaults(RawPopup));
