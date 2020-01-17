import React from 'react';
import { PURE } from '../../utils/pure';
import classnames from 'classnames';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';

export const TABLE = Symbol('Table') as symbol;

export type TTableTheme = {
	container?: string;
	head?: string;
	body?: string;
	row?: string;
	cell?: string;
	cell_isInHead?: string;
};

export type TFullTableProps = {
	theme: TTableTheme;
	children?: React.ReactNode;
};

export type TFullTableHeadProps = TFullTableProps;

export type TFullTableBodyProps = TFullTableProps;

export type TFullTableRowProps = TFullTableProps & {
	onClick?: React.MouseEventHandler<HTMLTableRowElement>;
	onMouseOver?: React.MouseEventHandler<HTMLTableRowElement>;
	onMouseOut?: React.MouseEventHandler<HTMLTableRowElement>;
	row?: string;
	isInHead?: boolean;
};

export type TFullTableCellProps = TFullTableProps & {
	onClick?: React.MouseEventHandler<HTMLTableRowElement>;
	onMouseOver?: React.MouseEventHandler<HTMLTableRowElement>;
	onMouseOut?: React.MouseEventHandler<HTMLTableRowElement>;
	style?: React.CSSProperties;
	colSpan?: number;
	rowSpan?: number;
	isInHead?: boolean;
};

@PURE
export default class RawTable extends React.Component<TFullTableProps> {
	render() {
		const { theme, children } = this.props;

		return <table className={theme.container}>{children}</table>;
	}
}

@PURE
export class RawTableHead extends React.Component<TFullTableHeadProps> {
	render() {
		const { children, theme } = this.props;

		return (
			<thead className={theme.head}>
				{React.Children.map(
					children,
					child =>
						React.isValidElement<TFullTableRowProps>(child) &&
						React.cloneElement(child, {
							isInHead: true,
						}),
				)}
			</thead>
		);
	}
}

@PURE
class RawTableBody extends React.Component<TFullTableBodyProps> {
	render() {
		const { children, theme } = this.props;

		return <tbody className={theme.body}>{children}</tbody>;
	}
}

@PURE
class RawTableRow extends React.Component<TFullTableRowProps> {
	render() {
		const { children, theme, onClick, onMouseOver, onMouseOut, isInHead } = this.props;

		return (
			<tr className={theme.row} onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
				{!isInHead && children}
				{isInHead &&
					React.Children.map(
						children,
						child =>
							React.isValidElement<TFullTableCellProps>(child) &&
							React.cloneElement(child, {
								...child.props,
								isInHead,
							}),
					)}
			</tr>
		);
	}
}

@PURE
class RawTableCell extends React.Component<TFullTableCellProps> {
	render() {
		const { children, theme, style, colSpan, rowSpan, isInHead } = this.props;

		const className = classnames(theme.cell, {
			[theme.cell_isInHead as string]: isInHead,
		});

		//noinspection JSUnusedLocalSymbols
		const Tag = isInHead ? 'th' : 'td';

		return (
			<Tag className={className} style={style} colSpan={colSpan} rowSpan={rowSpan}>
				{children}
			</Tag>
		);
	}
}

export type TTableProps = PartialKeys<TFullTableProps, 'theme'>;
export const Table: React.ComponentClass<TTableProps> = withTheme(TABLE)(RawTable);

export type TTableBodyProps = PartialKeys<TFullTableBodyProps, 'theme'>;
export const TableBody: React.ComponentClass<TTableBodyProps> = withTheme(TABLE)(RawTableBody);

export type TTableHeadProps = PartialKeys<TFullTableHeadProps, 'theme'>;
export const TableHead: React.ComponentClass<TTableHeadProps> = withTheme(TABLE)(RawTableHead);

export type TTableRowProps = PartialKeys<TFullTableRowProps, 'theme'>;
export const TableRow: React.ComponentClass<TTableRowProps> = withTheme(TABLE)(RawTableRow);

export type TTableCellProps = PartialKeys<TFullTableCellProps, 'theme'>;
export const TableCell: React.ComponentClass<TTableCellProps> = withTheme(TABLE)(RawTableCell);
