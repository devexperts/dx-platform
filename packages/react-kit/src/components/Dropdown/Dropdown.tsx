import React, { createRef, PropsWithChildren } from 'react';
import { PURE } from '../../utils/pure';
import { Component, ComponentClass, ComponentType, MouseEventHandler } from 'react';
import { Popover, TPopoverProps } from '../Popover/Popover';
import { WithInnerRef } from '../../utils/typings';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/platform-utils/dist/object/object';
import { TControlProps } from '../Control/Control';
import { withDefaults } from '../../utils/with-defaults';

export const DROPDOWN = Symbol('Dropdown') as symbol;

export type TAnchorProps = PropsWithChildren<
	WithInnerRef<{
		onClick: MouseEventHandler<Element>;
	}>
>;

export type TFullDropdownProps = PropsWithChildren<
	TControlProps<boolean | undefined, 'isOpened', 'onToggle'> & {
		Anchor: ComponentType<TAnchorProps>;
		Popover: ComponentType<TPopoverProps>;
		theme: {
			Popover?: TPopoverProps['theme'];
		};
		hasArrow?: boolean;
	}
>;

@PURE
class RawDropdown extends Component<TFullDropdownProps> {
	private anchorRef = createRef<HTMLButtonElement>();

	render() {
		const { Anchor, Popover, children, theme, hasArrow, isOpened } = this.props;

		return (
			<Anchor onClick={this.onAnchorClick} innerRef={this.anchorRef}>
				<Popover
					isOpened={isOpened}
					hasArrow={hasArrow}
					theme={theme.Popover}
					onRequestClose={this.onPopoverRequestClose}
					anchor={this.anchorRef}
					closeOnClickAway={true}>
					{children}
				</Popover>
			</Anchor>
		);
	}

	private onAnchorClick = () => {
		this.props.onToggle(!this.props.isOpened);
	};

	private onPopoverRequestClose = () => {
		this.props.onToggle(false);
	};
}

export type TDropdownProps = PartialKeys<TFullDropdownProps, 'theme' | 'Popover'>;
export const Dropdown: ComponentClass<TDropdownProps> = withTheme(DROPDOWN)(
	withDefaults<TFullDropdownProps, 'Popover'>({
		Popover,
	})(RawDropdown),
);
