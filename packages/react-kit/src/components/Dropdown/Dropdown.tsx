import React from 'react';
import { PURE } from '../../utils/pure';
import { Component, ComponentClass, ComponentType, MouseEventHandler, ReactNode } from 'react';
import { Popover, TPopoverProps } from '../Popover/Popover';
import { ReactRef, WithInnerRef } from '../../utils/typings';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { TControlProps } from '../Control/Control';
import { withDefaults } from '../../utils/with-defaults';

export const DROPDOWN = Symbol('Dropdown') as symbol;

export type TAnchorProps = WithInnerRef<{
	onClick: MouseEventHandler<Element>;
	children: ReactNode;
}>;

export type TFullDropdownProps = TControlProps<boolean | undefined, 'isOpened', 'onToggle'> & {
	Anchor: ComponentType<TAnchorProps>;
	Popover: ComponentType<TPopoverProps>;
	theme: {
		Popover?: TPopoverProps['theme'];
	};
	hasArrow?: boolean;
};

@PURE
class RawDropdown extends Component<TFullDropdownProps> {
	private anchorRef!: ReactRef;

	render() {
		const { Anchor, Popover, children, theme, hasArrow, isOpened } = this.props;

		return (
			<Anchor onClick={this.onAnchorClick} innerRef={this.innerRef}>
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

	private innerRef = (ref: ReactRef) => {
		this.anchorRef = ref;
	};

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
