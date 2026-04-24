import React, { Component, createContext } from 'react';
import classnames from 'classnames';
import { withTheme } from '../../utils/withTheme';
import { ComponentClass, MouseEventHandler, ReactNode } from 'react';
import { PartialKeys } from '@devexperts/platform-utils/dist/object/object';
import { PURE } from '../../utils/pure';

export const LIST = Symbol('List');

const Ctx = createContext<number>(0);

export type TFullListProps = {
	theme: {
		container?: string;
	};
	children: ReactNode;
	level?: number;
};

class RawList extends Component<TFullListProps> {
	render() {
		return <Ctx.Consumer>{level => this.renderContent(level)}</Ctx.Consumer>;
	}

	private renderContent = (level: number) => {
		const { theme, children } = this.props;
		const className = classnames(theme.container, theme[`container_level_${level}`]);

		return <ul className={className}>{children}</ul>;
	};
}

export type TListProps = PartialKeys<TFullListProps, 'theme'>;
export const List: ComponentClass<TListProps> = withTheme(LIST)(RawList);

export type TFullListItemProps = {
	theme: {
		item?: string;
	};
	children?: ReactNode;
	level?: number;
	onClick?: MouseEventHandler<HTMLElement>;
};

@PURE
class RawListItem extends Component<TFullListItemProps> {
	render() {
		return <Ctx.Consumer>{level => this.renderContent(level)}</Ctx.Consumer>;
	}

	private renderContent = (level: number) => {
		const { theme, onClick, children } = this.props;
		const className = classnames(theme.item, theme[`item_level_${level}`]);

		return (
			<li className={className} onClick={onClick}>
				{children}
			</li>
		);
	};
}

export type TListItemProps = PartialKeys<TFullListItemProps, 'theme'>;
export const ListItem: ComponentClass<TListItemProps> = withTheme(LIST)(RawListItem);

export type TFullListItemGroupProps = {
	isCollapsed?: boolean;
	children: ReactNode;
	header?: ReactNode;
	theme: {
		itemGroup?: string;
		itemGroup_isCollapsed?: string;
		itemGroup__header?: string;
	};
	onClick?: MouseEventHandler<HTMLElement>;
};

class RawListItemGroup extends Component<TFullListItemGroupProps> {
	static defaultProps = {
		isCollapsed: false,
	};

	render() {
		return <Ctx.Consumer>{level => this.renderContent(level)}</Ctx.Consumer>;
	}

	private renderContent = (level: number) => {
		const { theme, isCollapsed, children, header, onClick } = this.props;
		const className = classnames(theme.itemGroup, theme[`itemGroup_level_${level}`], {
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
