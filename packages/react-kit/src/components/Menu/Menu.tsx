import React from 'react';
import {
	List,
	ListItem,
	ListItemGroup,
	TFullListItemGroupProps,
	TFullListItemProps,
	TFullListProps,
	TListItemGroupProps,
	TListItemProps,
	TListProps,
} from '../List/List';
import { withTheme } from '../../utils/withTheme';
import { Component, ComponentClass, ComponentType, ReactElement, ReactNode, ReactText } from 'react';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { PURE } from '../../utils/pure';
import classnames from 'classnames';
import { Pure } from '../Pure/Pure';
import { ReactChildren } from '../../utils/typings';
import { withDefaults } from '../../utils/with-defaults';

export const MENU = Symbol('Menu') as symbol;

export type TMenuChildProps = {
	onSelect?: (value: ReactText) => void;
};

export type TFullMenuProps = TFullListProps & {
	List: ComponentType<TListProps>;
	onItemSelect?: (value: ReactText) => void;
	children: ReactChildren<ReactElement<TMenuChildProps>>;
};

class RawMenu extends React.Component<TFullMenuProps> {
	render() {
		const { children, List } = this.props;
		return (
			<List {...this.props}>
				{React.Children.map(children, child => {
					if (!React.isValidElement<TMenuChildProps>(child)) {
						return child;
					}
					const props: TMenuChildProps = {
						onSelect: this.props.onItemSelect,
					};
					return React.cloneElement(child, props);
				})}
			</List>
		);
	}
}

export type TMenuProps = PartialKeys<TFullMenuProps, 'theme' | 'List'>;
export const Menu: ComponentClass<TMenuProps> = withTheme(MENU)(
	withDefaults<TFullMenuProps, 'List'>({ List })(RawMenu),
);

///////////////////////////

export type TFullMenuItemProps = TFullListItemProps & {
	theme: {
		item_active?: string;
		item__content?: string;
	};
	ListItem: ComponentType<TListItemProps>;
	value: ReactText;
	isActive?: boolean;
	onSelect?: (value: ReactText) => void; //this is injected by Menu/MenuItemGroup
	text?: string;
	children?: ReactNode;
};

@PURE
class RawMenuItem extends Component<TFullMenuItemProps> {
	render() {
		const { isActive, ListItem } = this.props;
		let { theme } = this.props;
		if (isActive) {
			theme = {
				...theme,
				item: classnames(theme.item, theme.item_active),
			};
		}
		return (
			<ListItem onClick={this.onClick} {...this.props} theme={theme}>
				<div className={theme.item__content}>{this.props.children}</div>
			</ListItem>
		);
	}

	onClick = () => {
		this.props.onSelect && this.props.onSelect(this.props.value);
	};
}

export type TMenuItemProps = PartialKeys<TFullMenuItemProps, 'theme' | 'ListItem'>;
export const MenuItem: ComponentClass<TMenuItemProps> = withTheme(MENU)(
	withDefaults<TFullMenuItemProps, 'ListItem'>({ ListItem })(RawMenuItem),
);

///////////////////////////

export type TFullMenuItemGroupProps = TFullListItemGroupProps & {
	theme: {
		itemGroup__header__content?: string;
	};
	ListItemGroup: ComponentType<TListItemGroupProps>;
	List: ComponentType<TListProps>;
	onSelect?: (value: ReactText) => void; //this is injected by Menu/MenuItemGroup
	isCollapsed: boolean;
	header?: ReactNode;
};

type TMenuItemGroupState = {
	isCollapsed: boolean;
};

@PURE
class RawMenuItemGroup extends React.Component<TFullMenuItemGroupProps, TMenuItemGroupState> {
	state = {
		isCollapsed: true,
	};

	componentWillMount() {
		this.setState({
			isCollapsed: this.props.isCollapsed,
		});
	}

	componentWillReceiveProps(props: TFullMenuItemGroupProps) {
		this.setState({
			isCollapsed: props.isCollapsed,
		});
	}

	render() {
		const { children, theme, ListItemGroup } = this.props;

		let header;
		if (this.props.header) {
			header = <div className={theme.itemGroup__header__content}>{this.props.header}</div>;
		}

		return (
			<ListItemGroup onClick={this.onClick} {...this.props} header={header} isCollapsed={this.state.isCollapsed}>
				<Pure check={children}>
					{() =>
						React.isValidElement(children) &&
						React.cloneElement(React.Children.only(children), {
							onItemSelect: this.props.onSelect,
						})
					}
				</Pure>
			</ListItemGroup>
		);
	}

	onClick = () => {
		this.setState({
			isCollapsed: !this.state.isCollapsed,
		});
	};
}

export type TMenuItemGroupProps = PartialKeys<
	TFullMenuItemGroupProps,
	'theme' | 'List' | 'ListItemGroup' | 'isCollapsed'
>;
export const MenuItemGroup: ComponentClass<TMenuItemGroupProps> = withTheme(MENU)(
	withDefaults<TFullMenuItemGroupProps, 'ListItemGroup' | 'isCollapsed' | 'List'>({
		ListItemGroup,
		List: Menu as any,
		isCollapsed: true, //menu is always collapsed
	})(RawMenuItemGroup),
);
