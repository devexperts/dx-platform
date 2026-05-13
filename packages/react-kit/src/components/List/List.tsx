import React, { Component, createContext, PropsWithChildren } from 'react';
import classnames from 'classnames';
import { withTheme } from '../../utils/withTheme';
import { ComponentClass, MouseEventHandler, ReactNode } from 'react';
import { PartialKeys } from '@devexperts/platform-utils/dist/object/object';
import { PURE } from '../../utils/pure';

export const LIST = Symbol('List');

const Ctx = createContext<number>(0);

type ContainerTheme = Record<string, string | undefined> & {
	container?: string;
	container_level_0?: string;
	container_level_1?: string;
	container_level_2?: string;
	container_level_3?: string;
	container_level_4?: string;
	container_level_5?: string;
};
// eslint-disable-next-line prettier/prettier
type ContainerThemeLevel = Extract<keyof ContainerTheme, `container_level_${number}`>;

export type TFullListProps = PropsWithChildren<{
	theme?: ContainerTheme;
	level?: number;
}>;

class RawList extends Component<TFullListProps> {
	render() {
		return <Ctx.Consumer>{level => this.renderContent(level)}</Ctx.Consumer>;
	}

	private renderContent = (level: number) => {
		const { theme = {}, children } = this.props;
		const levelModifier = `container_level_${level}` as ContainerThemeLevel;
		const className = classnames(theme.container, theme[levelModifier]);

		return <ul className={className}>{children}</ul>;
	};
}

export type TListProps = PartialKeys<TFullListProps, 'theme'>;
export const List: ComponentClass<TListProps> = withTheme(LIST)(RawList);

type ItemTheme = Record<string, string | undefined> & {
	item?: string;
	item_level_0?: string;
	item_level_1?: string;
	item_level_2?: string;
	item_level_3?: string;
	item_level_4?: string;
	item_level_5?: string;
};
type ItemThemeLevel = Extract<keyof ItemTheme, `item_level_${number}`>;

export type TFullListItemProps = PropsWithChildren<{
	theme?: ItemTheme;
	level?: number;
	onClick?: MouseEventHandler<HTMLElement>;
}>;

@PURE
class RawListItem extends Component<TFullListItemProps> {
	render() {
		return <Ctx.Consumer>{level => this.renderContent(level)}</Ctx.Consumer>;
	}

	private renderContent = (level: number) => {
		const { theme = {}, onClick, children } = this.props;
		const itemLevelModifier = `item_level_${level}` as ItemThemeLevel;
		const className = classnames(theme.item, theme[itemLevelModifier]);

		return (
			<li className={className} onClick={onClick}>
				{children}
			</li>
		);
	};
}

export type TListItemProps = PartialKeys<TFullListItemProps, 'theme'>;
export const ListItem: ComponentClass<TListItemProps> = withTheme(LIST)(RawListItem);

type ItemGroupTheme = Record<string, string | undefined> & {
	itemGroup?: string;
	itemGroup_isCollapsed?: string;
	itemGroup__header?: string;
	itemGroup_level_0?: string;
	itemGroup_level_1?: string;
	itemGroup_level_2?: string;
	itemGroup_level_3?: string;
	itemGroup_level_4?: string;
	itemGroup_level_5?: string;
};
type ItemGroupThemeLevel = Extract<keyof ItemGroupTheme, `itemGroup_level_${number}`>;

export type TFullListItemGroupProps = PropsWithChildren<{
	isCollapsed?: boolean;
	header?: ReactNode;
	theme?: ItemGroupTheme;
	onClick?: MouseEventHandler<HTMLElement>;
}>;

class RawListItemGroup extends Component<TFullListItemGroupProps> {
	static defaultProps = {
		isCollapsed: false,
	};

	render() {
		return <Ctx.Consumer>{level => this.renderContent(level)}</Ctx.Consumer>;
	}

	private renderContent = (level: number) => {
		const { theme = {}, isCollapsed, children, header, onClick } = this.props;
		const itemGroupModifier = `itemGroup_level_${level}` as ItemGroupThemeLevel;
		const className = classnames(theme.itemGroup, theme[itemGroupModifier], {
			[theme.itemGroup_isCollapsed as string]: isCollapsed,
		});

		return (
			<li className={className}>
				<span className={theme.itemGroup__header} onClick={onClick}>
					{header}
				</span>
				<Ctx.Provider value={level + 1}>{children}</Ctx.Provider>
			</li>
		);
	};
}

export type TListItemGroupProps = PartialKeys<TFullListItemGroupProps, 'theme'>;
export const ListItemGroup = withTheme(LIST)(RawListItemGroup);
