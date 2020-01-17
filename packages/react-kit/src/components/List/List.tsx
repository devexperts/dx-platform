import React from 'react';
import classnames from 'classnames';
import { withTheme } from '../../utils/withTheme';
import { ComponentClass, MouseEventHandler, ReactNode } from 'react';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { PURE } from '../../utils/pure';

export const LIST = Symbol('List') as symbol;
const CONTEXT_LEVEL_KEY = '__LIST_CONTEXT_LEVEL_KEY__';
const CONTEXT_TYPES: any = {
	[CONTEXT_LEVEL_KEY]() {},
};

export type TFullListProps = {
	theme: {
		container?: string;
	};
	children: ReactNode;
	level?: number;
};

class RawList extends React.Component<TFullListProps> {
	static contextTypes = CONTEXT_TYPES;

	render() {
		const level = this.context[CONTEXT_LEVEL_KEY] || 0;
		const { theme, children } = this.props;
		const className = classnames(theme.container, theme[`container_level_${level}`]);

		return <ul className={className}>{children}</ul>;
	}
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
class RawListItem extends React.Component<TFullListItemProps> {
	static contextTypes = CONTEXT_TYPES;

	render() {
		const { theme, onClick, children } = this.props;
		const level = this.context[CONTEXT_LEVEL_KEY] || 0;
		const className = classnames(theme.item, theme[`item_level_${level}`]);

		return (
			<li className={className} onClick={onClick}>
				{children}
			</li>
		);
	}
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

class RawListItemGroup extends React.Component<TFullListItemGroupProps> {
	static defaultProps = {
		isCollapsed: false,
	};

	static contextTypes = CONTEXT_TYPES;

	static childContextTypes = CONTEXT_TYPES;

	getChildContext() {
		return {
			[CONTEXT_LEVEL_KEY]: (this.context[CONTEXT_LEVEL_KEY] || 0) + 1,
		};
	}

	render() {
		const { theme, isCollapsed, children, header, onClick } = this.props;
		const level = this.context[CONTEXT_LEVEL_KEY] || 0;
		const className = classnames(theme.itemGroup, theme[`itemGroup_level_${level}`], {
			[theme.itemGroup_isCollapsed as string]: isCollapsed,
		});

		return (
			<li className={className}>
				<span className={theme.itemGroup__header} onClick={onClick}>
					{header}
				</span>
				{children}
			</li>
		);
	}
}

export type TListItemGroupProps = PartialKeys<TFullListItemGroupProps, 'theme'>;
export const ListItemGroup: ComponentClass<TListItemGroupProps> = withTheme(LIST)(RawListItemGroup);
