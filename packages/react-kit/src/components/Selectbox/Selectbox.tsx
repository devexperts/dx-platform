import * as React from 'react';
import { SelectboxAnchor, TFullSelectboxAnchorProps, TSelectboxAnchorProps } from './SelectboxAnchor';
import { Popover, TFullPopoverProps, TPopoverProps } from '../Popover/Popover';
import { Menu, TFullMenuProps, TMenuItemProps, TMenuProps } from '../Menu/Menu';
import { PURE } from '../../utils/pure';
import * as classnames from 'classnames';
import { withTheme } from '../../utils/withTheme';
import { Component, ComponentClass, ComponentType, ReactElement, ReactNode, ReactText } from 'react';
import { ObjectClean } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { TControlProps } from '../Control/Control';
import { NativeResizeDetector } from '../ResizeDetector/ResizeDetector';
import { findDOMNode } from 'react-dom';
import { raf } from '@devexperts/utils/dist/function/raf';

export const SELECTBOX= Symbol('Selectbox') as symbol;

export type TFullSelectboxProps = TControlProps<ReactText> & {
	theme: {
		container_isOpened?: string;
		container__popover?: string;
		container__popover__content?: string;
		container__menu?: string;
		container__menu_hasSelectedItem?: string;
		container__item?: string;
		container__item_isActive?: string;
		container__item__text?: string;
		container__item__activeIcon?: string;
		container__anchor?: string;
		container__anchor__content?: string;
		container__anchor__text?: string;
		container__anchor__content_hasCaret?: string;
		container__anchor__wrapperCaret?: string;
		container__anchor__caret?: string;
		container__anchor__caret_isReversed?: string;
	};
	children: ReactElement<TMenuItemProps>[] | ReactElement<TMenuItemProps>;
	isDisabled?: boolean;
	isLoading?: boolean;
	placeholder?: string;

	Anchor: ComponentClass<TSelectboxAnchorProps>;
	Menu: ComponentType<TMenuProps>;
	Popover: ComponentType<TPopoverProps>;

	caretIcon?: React.ReactElement<any> | React.ReactText;
	selectedIcon?: React.ReactElement<any> | React.ReactText;
	shouldSyncWidth?: boolean;
};

type TSelectboxState = {
	isOpened: boolean;
	width?: number;
};

@PURE
class RawSelectbox extends React.Component<TFullSelectboxProps, TSelectboxState> {
	static propTypes: any = {
		value(props: TFullSelectboxProps) {
			const type = typeof props.value;
			if (type !== 'undefined') {
				if (type !== 'string' && type !== 'number') {
					throw new Error('Value should be a string or a number');
				} else {
					if (
						!React.Children.toArray(props.children).find(
							(child: ReactElement<TMenuItemProps>) => child.props.value === props.value,
						)
					) {
						throw new Error('Value should be in passed children');
					}
				}
			}
		},
	};

	static defaultProps = {
		Anchor: SelectboxAnchor,
		Menu,
		Popover,
	};

	state: TSelectboxState = {
		isOpened: false,
	};

	private _anchor: Component<TSelectboxAnchorProps> | null;
	private get anchor() {
		return this._anchor;
	}

	private set anchor(value) {
		if (this._anchor !== value) {
			//uninstall previous
			if (this.anchor && this.props.shouldSyncWidth) {
				const element = findDOMNode(this.anchor);
				NativeResizeDetector.uninstall(element);
			}

			//install new
			this._anchor = value;
			if (this.anchor && this.props.shouldSyncWidth) {
				const element = findDOMNode(this.anchor);
				NativeResizeDetector.listenTo(element, this.handleAnchorResize);
			}
		}
	}

	componentDidMount() {
		// if (this.anchor && this.props.shouldSyncWidth) {
		// 	const element = findDOMNode(this.anchor);
		// 	NativeResizeDetector.listenTo(element, this.handleAnchorResize);
		// }
	}

	componentDidUpdate(newProps: TFullSelectboxProps) {
		//todo: rebind
	}

	componentWillUnmount() {
		if (this.anchor) {
			const element = findDOMNode(this.anchor);
			NativeResizeDetector.uninstall(element);
		}
	}

	render() {
		const {
			Anchor,
			Popover,
			Menu,
			placeholder,
			children,
			caretIcon,
			theme,
			value,
			selectedIcon,
			isDisabled,
			isLoading,
		} = this.props;

		const menuTheme: TFullMenuProps['theme'] = {
			container: classnames(theme.container__menu, {
				[theme.container__menu_hasSelectedItem as string]:
					typeof selectedIcon !== 'undefined' && typeof this.props.value !== 'undefined',
			}),
		};

		const anchorTheme: TFullSelectboxAnchorProps['theme'] = {
			container: theme.container__anchor,
			container_isOpened: theme.container_isOpened,
			text: theme.container__anchor__text,
			content: classnames(theme.container__anchor__content, {
				[theme.container__anchor__content_hasCaret as string]: !!caretIcon,
			}),
		};

		if (caretIcon) {
			anchorTheme.caret = classnames(theme.container__anchor__caret, {
				[theme.container__anchor__caret_isReversed as string]: this.state.isOpened,
			});
			anchorTheme.wrapperCaret = theme.container__anchor__wrapperCaret;
		}

		const popoverTheme: TFullPopoverProps['theme'] = {
			container: classnames(theme.container__popover),
			content: theme.container__popover__content,
		};

		let valueText: ReactNode = placeholder;
		if (typeof value !== 'undefined') {
			const valueChild = React.Children.toArray(children).find(
				(child: ReactElement<TMenuItemProps>) => child.props.value === value,
			) as ReactElement<TMenuItemProps>;
			//existance is checked in prop types
			if (valueChild) {
				valueText = valueChild.props.text || valueChild.props.children;
			}
		}

		let popoverStyle;
		if (typeof this.state.width !== 'undefined' && this.props.shouldSyncWidth) {
			popoverStyle = {
				width: this.state.width,
			};
		}

		return (
			<Anchor
				ref={el => (this.anchor = el)}
				isDisabled={isDisabled}
				isLoading={isLoading}
				theme={anchorTheme}
				caretIcon={caretIcon}
				isOpened={this.state.isOpened}
				value={value}
				valueText={valueText}
				onClick={this.onAnchorClick}>
				<Popover
					isOpened={this.state.isOpened}
					style={popoverStyle}
					theme={popoverTheme}
					closeOnClickAway={true}
					onRequestClose={this.onPopoverRequestClose}
					anchor={this.anchor}>
					<Menu onItemSelect={this.onItemSelect} theme={menuTheme}>
						{React.Children.map(children, this.wrapItem)}
					</Menu>
				</Popover>
			</Anchor>
		);
	}

	wrapItem = (child: ReactElement<TMenuItemProps>) => {
		const { theme, selectedIcon } = this.props;
		const { value } = child.props;
		const isActive = typeof value !== 'undefined' && value === this.props.value;

		const props: TMenuItemProps = Object.assign({}, child.props, {
			isActive,
			text: child.props.children,
			children: (
				<div className={theme.container__item}>
					<div className={theme.container__item__text}>{child.props.children}</div>
					{isActive && <span className={theme.container__item__activeIcon}>{selectedIcon}</span>}
				</div>
			),
		});
		return React.cloneElement(child, props);
	};

	onAnchorClick = () => {
		this.setState({
			isOpened: !this.state.isOpened,
		});
	};

	onItemSelect = (value: ReactText) => {
		this.setState({
			isOpened: false,
		});
		this.props.onValueChange && this.props.onValueChange(value);
	};

	onPopoverRequestClose = () => {
		this.setState({
			isOpened: false,
		});
	};

	handleAnchorResize = raf((element: Element) => {
		const { width } = element.getBoundingClientRect();
		if (this.state.width !== width) {
			this.setState({
				width,
			});
		}
	});
}

export type TSelectboxProps = ObjectClean<PartialKeys<TFullSelectboxProps, 'theme' | 'Anchor' | 'Menu' | 'Popover'>>;
export const Selectbox: ComponentClass<TSelectboxProps> = withTheme(SELECTBOX)(RawSelectbox);
