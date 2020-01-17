import React from 'react';
import { SelectboxAnchor, TFullSelectboxAnchorProps, TSelectboxAnchorProps } from './SelectboxAnchor';
import { Popover, TFullPopoverProps, TPopoverProps } from '../Popover/Popover';
import { Menu, TFullMenuProps, TMenuItemProps, TMenuProps } from '../Menu/Menu';
import { PURE } from '../../utils/pure';
import classnames from 'classnames';
import { withTheme } from '../../utils/withTheme';
import { Component, ComponentClass, ComponentType, ReactElement, ReactNode, ReactText } from 'react';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { TControlProps } from '../Control/Control';
import { NativeResizeDetector } from '../ResizeDetector/ResizeDetector';
import { findDOMNode } from 'react-dom';
import { raf } from '@devexperts/utils/dist/function/raf';
import { withDefaults } from '../../utils/with-defaults';
export const SELECTBOX = Symbol('Selectbox') as symbol;

export type SelectboxValue = ReactText | ReactText[] | undefined;
type SelectboxChildren = ReactElement<TMenuItemProps>[] | ReactElement<TMenuItemProps>;

export type TFullSelectboxProps = TControlProps<SelectboxValue> &
	TControlProps<boolean | undefined, 'isOpened', 'onToggle'> & {
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
		multipleFormatter?: (value: ReactText[]) => ReactNode;
		children: SelectboxChildren;
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
	width?: number;
};

const getValues = (value?: SelectboxValue) => {
	if (typeof value === 'undefined') {
		return [];
	}
	return Array.isArray(value) ? value : [value];
};

const getValuesFromChildren = (children: SelectboxChildren) => {
	return React.Children.toArray(children).map(
		child => React.isValidElement<TMenuItemProps>(child) && child.props.value,
	);
};

@PURE
class RawSelectbox extends React.Component<TFullSelectboxProps, TSelectboxState> {
	static propTypes: any = {
		value(props: TFullSelectboxProps) {
			const type = typeof props.value;
			if (typeof props.value !== 'undefined') {
				const isArray = Array.isArray(props.value);
				if (type !== 'string' && type !== 'number' && !isArray) {
					throw new Error('Value should be a string or a number or a array of string|number');
				} else {
					const values = getValues(props.value);
					const allAvailableValues = getValuesFromChildren(props.children);
					if (values.length && !values.filter(value => allAvailableValues.indexOf(value) !== -1).length) {
						throw new Error('Value should be in passed children');
					}
				}
			}
		},
	};

	readonly state: TSelectboxState = {};

	private _anchor!: Component<TSelectboxAnchorProps> | null;
	private get anchor() {
		return this._anchor;
	}

	private set anchor(value) {
		if (this._anchor !== value) {
			//uninstall previous
			if (this.anchor && this.props.shouldSyncWidth) {
				const element = findDOMNode(this.anchor);
				if (!element || element instanceof Text) {
					return;
				}
				NativeResizeDetector.uninstall(element);
			}

			//install new
			this._anchor = value;
			if (this.anchor && this.props.shouldSyncWidth) {
				const element = findDOMNode(this.anchor);
				if (!element || element instanceof Text) {
					return;
				}
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
			if (!element || element instanceof Text) {
				return;
			}
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
			multipleFormatter,
			caretIcon,
			theme,
			value,
			selectedIcon,
			isDisabled,
			isLoading,
			isOpened,
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
				[theme.container__anchor__caret_isReversed as string]: isOpened,
			});
			anchorTheme.wrapperCaret = theme.container__anchor__wrapperCaret;
		}

		const popoverTheme: TFullPopoverProps['theme'] = {
			container: classnames(theme.container__popover),
			content: theme.container__popover__content,
		};

		let valueText: ReactNode = placeholder;

		if (Array.isArray(value) && value.length) {
			const predicate = (child: ReactNode): child is ReactElement<TMenuItemProps> =>
				React.isValidElement<TMenuItemProps>(child) && value.indexOf(child.props.value) !== -1;

			const result = React.Children.toArray(children)
				.filter(predicate)
				.reduce((acc: ReactNode[], valueChild) => {
					return [...acc, valueChild.props.text || valueChild.props.children];
				}, []);

			valueText = multipleFormatter ? multipleFormatter(value) : result;
		} else if (typeof value !== 'undefined') {
			const predicate = (child: ReactNode): child is ReactElement<TMenuItemProps> =>
				React.isValidElement<TMenuItemProps>(child) && child.props.value === value;

			const valueChild = React.Children.toArray(children).find(predicate);
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

		const values = getValues(value);

		return (
			<Anchor
				ref={el => (this.anchor = el)}
				isDisabled={isDisabled}
				isLoading={isLoading}
				theme={anchorTheme}
				caretIcon={caretIcon}
				isOpened={isOpened}
				value={value}
				valueText={valueText}
				onClick={this.onAnchorClick}>
				<Popover
					isOpened={isOpened}
					style={popoverStyle}
					theme={popoverTheme}
					closeOnClickAway={true}
					onRequestClose={this.onPopoverRequestClose}
					anchor={this.anchor}>
					<Menu onItemSelect={this.onItemSelect} theme={menuTheme}>
						{React.Children.map(children, this.wrapItem(values)) as any}
					</Menu>
				</Popover>
			</Anchor>
		);
	}

	wrapItem = (values: ReactText[]) => (child: ReactElement<TMenuItemProps> | ReactText) => {
		if (!React.isValidElement<TMenuItemProps>(child)) {
			return child;
		}
		const { theme, selectedIcon } = this.props;
		const { value } = child.props;
		const isActive = values.indexOf(value) !== -1;

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
		const { onToggle } = this.props;

		if (onToggle) {
			onToggle(!this.props.isOpened);
		}
	};

	onItemSelect = (value: ReactText | undefined) => {
		const { onToggle, value: prevValue, onValueChange } = this.props;
		if (!Array.isArray(prevValue)) {
			onValueChange(value);
		} else {
			const values = getValues(prevValue);
			if (typeof value !== 'undefined') {
				const index = values.indexOf(value);
				if (index !== -1) {
					const newValue = [...values.slice(0, index), ...values.slice(index + 1)];
					onValueChange(newValue);
				} else {
					const newValue = [...values, value];
					onValueChange(newValue);
				}
			}
		}
		this.focusOnAnchor();

		if (onToggle && !Array.isArray(prevValue)) {
			onToggle(false);
		}
	};

	onPopoverRequestClose = () => {
		const { onToggle } = this.props;

		if (onToggle) {
			onToggle(false);
		}
	};

	handleAnchorResize = raf((element: Element) => {
		const { width } = element.getBoundingClientRect();
		if (this.state.width !== width) {
			this.setState({
				width,
			});
		}
	});

	private focusOnAnchor() {
		if (!this.anchor) {
			return;
		}
		const anchor = findDOMNode(this.anchor);
		if (anchor instanceof HTMLElement) {
			anchor.focus();
		}
	}
}

export type TSelectboxProps = PartialKeys<TFullSelectboxProps, 'theme' | 'Anchor' | 'Menu' | 'Popover'>;
export const Selectbox: ComponentClass<TSelectboxProps> = withTheme(SELECTBOX)(
	withDefaults<TFullSelectboxProps, 'Anchor' | 'Menu' | 'Popover'>({
		Anchor: SelectboxAnchor,
		Menu,
		Popover,
	})(RawSelectbox),
);
