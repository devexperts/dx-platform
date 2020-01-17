import React from 'react';
import ReactDOM from 'react-dom';
import prefix from '@devexperts/utils/dist/dom/prefix';
import { PURE } from '../../utils/pure';
import { Pure } from '../Pure/Pure';
import {
	Table as BasicTable,
	TableBody as BasicTableBody,
	TableHead as BasicTableHead,
	TableCell as BasicTableCell,
	TableRow as BasicTableRow,
	TFullTableProps,
	TTableProps,
	TFullTableBodyProps,
	TFullTableRowProps,
	TFullTableCellProps,
	TFullTableHeadProps,
	TTableHeadProps,
	TTableRowProps,
	TTableCellProps,
	TTableTheme,
} from '../Table/Table';
import Emitter from '@devexperts/utils/dist/emitter/Emitter';
import { Scrollable } from '../Scrollable/Scrollable';
import classnames from 'classnames';
import { Omit } from 'typelevel-ts';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { withTheme } from '../../utils/withTheme';
import { constNull } from 'fp-ts/lib/function';

export const GRID = Symbol('Grid') as symbol;

const EVENT_GRID = {
	BODY_SCROLL: 'EVENT_GRID:BODY_SCROLL',
	BODY_SCROLLBAR_APPEAR: 'EVENT_GRID:BODU_SCROLLBAR_APPER',
	CELL_MOUNT: 'EVENT_GRID:CELL_MOUNT',
	CELL_UPDATE: 'EVENT_GRID:CELL_UPDATE',
	GRID_MOUNT: 'EVENT_GRID:GRID_MOUNT',
	GRID_UPDATE: 'EVENT_GRID:GRID_UPDATE',
};

class GridInternalEmitter extends Emitter {
	emit(event: any, ...args: any[]) {
		this._emit(event, ...args);
	}
}

const GRID_CONTEXT_EMITTER = '__GRID_CONTEXT_EMITTER__';
const CONTEXT_TYPES = {
	[GRID_CONTEXT_EMITTER]: constNull,
};

export type TFullGridProps = Omit<TFullTableProps, 'theme'> & {
	theme: TTableTheme & {
		gridHead?: string;
		gridHead_paddedForScrollbar?: string;
		gridHead__content?: string;
		gridBody?: string;
		horizontal_scrollbar__bar?: string;
		vertical_scrollbar__bar?: string;
		gridCell__content?: string;
		gridCell__content_left?: string;
		gridCell__content_center?: string;
		gridCell__content_right?: string;
		cell_left?: string;
		cell_center?: string;
		cell_right?: string;
		gridCell__placeholder?: string;
	};
};

@PURE
class RawGrid extends React.Component<TFullGridProps> {
	static childContextTypes = CONTEXT_TYPES;

	_emitter!: GridInternalEmitter;

	_rows = {
		head: {},
		body: {},
	};
	_maxColumnWidths = {};

	getChildContext() {
		return {
			[GRID_CONTEXT_EMITTER]: this._emitter,
		};
	}

	componentDidMount() {
		this._emitter.emit(EVENT_GRID.GRID_MOUNT, this._maxColumnWidths);
		this._emitter.off(EVENT_GRID.CELL_MOUNT, this.onCellMount);
		this._emitter.on(EVENT_GRID.CELL_MOUNT, this.onCellRemount);
		//start listening to cell updates
		this._emitter.on(EVENT_GRID.CELL_UPDATE, this.onCellUpdate);
	}

	componentWillMount() {
		this._emitter = new GridInternalEmitter();
		this._emitter.on(EVENT_GRID.CELL_MOUNT, this.onCellMount);
	}

	componentWillUnmount() {
		this._emitter.off(EVENT_GRID.CELL_MOUNT, this.onCellRemount);
		this._emitter.off(EVENT_GRID.CELL_UPDATE, this.onCellUpdate);
	}

	componentDidUpdate() {
		//this is called after all cells updated
		//notify head
		this._emitter.emit(EVENT_GRID.GRID_UPDATE, this._maxColumnWidths);
	}

	render() {
		const { theme, children } = this.props;
		return <div className={theme.container}>{children}</div>;
	}

	onCellMount = (rowIndex: number, columnIndex: number, width: number, isInHead: boolean) => {
		const rowStorage = isInHead ? this._rows.head : this._rows.body;
		//set or update row storage
		if (!rowStorage[rowIndex]) {
			rowStorage[rowIndex] = {
				columns: {},
			};
		}
		rowStorage[rowIndex].columns[columnIndex] = width;
		//detect max width
		const maxColumnWidthByIndex = this._maxColumnWidths[columnIndex];
		if (!maxColumnWidthByIndex || (maxColumnWidthByIndex && maxColumnWidthByIndex < width)) {
			this._maxColumnWidths[columnIndex] = width;
		}
	};

	onCellRemount = () => {
		throw new Error('Grid does not support dynamic row/cell mounts');
	};

	onCellUpdate = (rowIndex: number, columnIndex: number, newWidth: number, isInHead: boolean) => {
		//update row storage
		const rowStorage = isInHead ? this._rows.head : this._rows.body;
		rowStorage[rowIndex].columns[columnIndex] = newWidth;
		//update max width
		this._maxColumnWidths[columnIndex] = Math.max(
			...Object.keys(this._rows.head).map(key => this._rows.head[key].columns[columnIndex]),
			...Object.keys(this._rows.body).map(key => this._rows.body[key].columns[columnIndex]),
		);
	};
}

export type TFullGridHeadProps = TFullGridProps &
	TFullTableHeadProps & {
		Table?: React.ComponentClass<TTableProps>;
		TableHead?: React.ComponentClass<TTableHeadProps>;
	};

@PURE
class RawGridHead extends React.Component<TFullGridHeadProps> {
	static contextTypes = CONTEXT_TYPES;

	state = {
		scrollLeft: 0,
		withVerticalScrollbar: false,
		columns: {},
	};

	componentDidMount() {
		const emitter = this.context[GRID_CONTEXT_EMITTER];
		emitter.on(EVENT_GRID.BODY_SCROLL, this.onGridBodyScroll);
		emitter.on(EVENT_GRID.BODY_SCROLLBAR_APPEAR, this.onGridBodyScrollbarAppear);
	}

	componentWillUnmount() {
		const emitter = this.context[GRID_CONTEXT_EMITTER];
		emitter.off(EVENT_GRID.BODY_SCROLL, this.onGridBodyScroll);
		emitter.off(EVENT_GRID.BODY_SCROLLBAR_APPEAR, this.onGridBodyScrollbarAppear);
	}

	render() {
		const { Table = BasicTable, theme, TableHead = BasicTableHead, ...props } = this.props;
		const { scrollLeft, withVerticalScrollbar } = this.state;
		let style;
		if (typeof scrollLeft !== 'undefined') {
			style = prefix({
				transform: `translateX(-${scrollLeft}px)`,
			});
		}

		const className = classnames(theme.gridHead, {
			[theme.gridHead_paddedForScrollbar as string]: withVerticalScrollbar,
		});

		//todo support multiple rows in head

		return (
			<div className={className}>
				<div className={theme.gridHead__content} style={style}>
					<Pure {...this.props} check={this.state.columns} check2={props.children}>
						{() => (
							<Table theme={theme}>
								<TableHead theme={theme} {...props}>
									{React.Children.only(props.children)}
								</TableHead>
							</Table>
						)}
					</Pure>
				</div>
			</div>
		);
	}

	onGridBodyScroll = (scrollLeft: number, scrollTop: number) => {
		this.setState({
			scrollLeft,
		});
	};

	onGridBodyScrollbarAppear = (withHorizontalScrollbar: boolean, withVerticalScrollbar: boolean) => {
		this.setState({
			withHorizontalScrollbar,
			withVerticalScrollbar,
		});
	};

	onGridMount = (columns: {}) => {
		this.setState({
			columns: {
				...columns,
			},
		});
	};
}

export type TFullGridBodyProps = TFullGridProps &
	TFullTableBodyProps & {
		Table?: React.ComponentClass<TTableProps>;
		TableBody?: React.ComponentClass<TTableHeadProps>;
	};

@PURE
// @themr(GRID)
class RawGridBody extends React.Component<TFullGridBodyProps> {
	static contextTypes = CONTEXT_TYPES;

	_scrollLeft!: number;
	_withVerticalScrollbar!: boolean;
	_withHorizontalScrollbar!: boolean;

	render() {
		const { Table = BasicTable, TableBody = BasicTableBody, theme, ...props } = this.props;

		const scrollableTheme = {
			horizontal_scrollbar__bar: theme.horizontal_scrollbar__bar,
			vertical_scrollbar__bar: theme.vertical_scrollbar__bar,
			container: undefined as any,
		};

		return (
			<Scrollable onScroll={this.onScroll} onUpdate={this.onUpdate} theme={scrollableTheme}>
				<div className={theme.gridBody}>
					<Table theme={theme}>
						<TableBody theme={theme} {...props}>
							{React.Children.map(props.children, (child, i) =>
								React.cloneElement(
									child as React.ReactElement<TFullGridRowProps>,
									{
										// dont forget
										gridRowIndexKey: i,
									} as TFullGridRowProps,
								),
							)}
						</TableBody>
					</Table>
				</div>
			</Scrollable>
		);
	}

	onScroll = (scrollLeft: number, scrollTop: number) => {
		if (this._scrollLeft !== scrollLeft) {
			this._scrollLeft = scrollLeft;
			this.context[GRID_CONTEXT_EMITTER].emit(EVENT_GRID.BODY_SCROLL, scrollLeft, scrollTop);
		}
	};

	onUpdate = (withHorizontalScrollbar: boolean, withVerticalScrollbar: boolean) => {
		if (
			this._withHorizontalScrollbar !== withHorizontalScrollbar ||
			this._withVerticalScrollbar !== withVerticalScrollbar
		) {
			this._withVerticalScrollbar = withVerticalScrollbar;
			this._withHorizontalScrollbar = withHorizontalScrollbar;
			this.context[GRID_CONTEXT_EMITTER].emit(
				EVENT_GRID.BODY_SCROLLBAR_APPEAR,
				withHorizontalScrollbar,
				withVerticalScrollbar,
			);
		}
	};
}

export type TFullGridRowProps = TFullGridProps &
	TFullTableRowProps & {
		TableRow?: React.ComponentClass<TTableRowProps>;
		gridRowIndexKey?: number;
	};

@PURE
// @themr(GRID)
class RawGridRow extends React.Component<TFullGridRowProps> {
	static contextTypes = CONTEXT_TYPES;

	state = {
		columns: {},
	};

	componentWillMount() {
		const emitter = this.context[GRID_CONTEXT_EMITTER];
		emitter.on(EVENT_GRID.GRID_MOUNT, this.onGridMount);
		emitter.on(EVENT_GRID.GRID_UPDATE, this.onGridUpdate);
	}

	componentWillUnmount() {
		const emitter = this.context[GRID_CONTEXT_EMITTER];
		emitter.on(EVENT_GRID.GRID_MOUNT, this.onGridMount);
		emitter.on(EVENT_GRID.GRID_UPDATE, this.onGridUpdate);
	}

	render() {
		const { TableRow = BasicTableRow, ...props } = this.props;
		const rowIndex = this.props.gridRowIndexKey;
		return (
			<TableRow {...props}>
				{React.Children.map(this.props.children, (child, i) => {
					if (!React.isValidElement<TFullGridCellProps>(child)) {
						return child;
					}
					const newProps: Partial<TFullGridCellProps> = {
						gridRowIndexKey: rowIndex,
						gridColumnIndexKey: i,
					};
					if (this.state.columns) {
						newProps.gridColumnWidth = this.state.columns[i];
					}
					return React.cloneElement(child as any, newProps); //dont forget
				})}
			</TableRow>
		);
	}

	onGridMount = (columns: {}) => {
		this.setState({
			columns: {
				...columns,
			},
		});
	};

	onGridUpdate = (columns: {}) => {
		this.setState({
			columns: {
				...columns,
			},
		});
	};
}

/**
 * @enum
 */
export enum GridCellAlignment {
	LEFT = 'GRID_CELL_ALIGN:LEFT',
	CENTER = 'GRID_CELL_ALIGN:CENTER',
	RIGHT = 'GRID_CELL_ALIGN:RIGHT',
}

export type TFullGridCellProps = TFullGridProps &
	TFullTableCellProps & {
		TableCell?: React.ComponentClass<TTableCellProps>;
		gridRowIndexKey?: number;
		gridColumnIndexKey?: number;
		gridColumnWidth?: number;
		align?: GridCellAlignment;
	};

@PURE
// @themr(GRID)
class RawGridCell extends React.Component<TFullGridCellProps> {
	static contextTypes = CONTEXT_TYPES;

	_content: any;
	_width!: number;

	componentDidMount() {
		const contentDOMNode = ReactDOM.findDOMNode(this._content);
		if (!contentDOMNode || contentDOMNode instanceof Text) {
			return;
		}
		this._width = contentDOMNode.clientWidth;
		const emitter = this.context[GRID_CONTEXT_EMITTER];
		emitter.emit(
			EVENT_GRID.CELL_MOUNT,
			this.props.gridRowIndexKey,
			this.props.gridColumnIndexKey,
			this._width,
			this.props.isInHead,
		);
	}

	componentDidUpdate() {
		const contentDOMNode = ReactDOM.findDOMNode(this._content);
		if (!contentDOMNode || contentDOMNode instanceof Text) {
			return;
		}
		const newWidth = contentDOMNode.clientWidth;
		if (newWidth !== this._width) {
			this._width = newWidth;
			const emitter = this.context[GRID_CONTEXT_EMITTER];
			emitter.emit(
				EVENT_GRID.CELL_UPDATE,
				this.props.gridRowIndexKey,
				this.props.gridColumnIndexKey,
				newWidth,
				this.props.isInHead,
			);
		}
	}

	render() {
		const {
			TableCell = BasicTableCell,
			align = GridCellAlignment.CENTER,
			gridRowIndexKey,
			gridColumnIndexKey,
			gridColumnWidth,
			colSpan,
			rowSpan,
			...restProps
		} = this.props;

		let style;
		if (typeof gridColumnWidth !== 'undefined') {
			style = {
				width: `${gridColumnWidth}px`,
			};
		}

		const contentClassName = classnames(restProps.theme.gridCell__content, {
			[restProps.theme.gridCell__content_left as string]: align === GridCellAlignment.LEFT,
			[restProps.theme.gridCell__content_center as string]: align === GridCellAlignment.CENTER,
			[restProps.theme.gridCell__content_right as string]: align === GridCellAlignment.RIGHT,
		});

		const tableCellTheme = {
			...restProps.theme,
			cell: classnames(restProps.theme.cell, {
				[restProps.theme.cell_left as string]: align === GridCellAlignment.LEFT,
				[restProps.theme.cell_center as string]: align === GridCellAlignment.CENTER,
				[restProps.theme.cell_right as string]: align === GridCellAlignment.RIGHT,
			}),
		};

		return (
			<TableCell {...restProps} theme={tableCellTheme}>
				<span style={style} className={restProps.theme.gridCell__placeholder}>
					<span className={contentClassName} ref={el => (this._content = el)}>
						{restProps.children}
					</span>
				</span>
			</TableCell>
		);
	}
}

export type TGridProps = PartialKeys<TFullGridProps, 'theme'>;
export const Grid: React.ComponentClass<TGridProps> = withTheme(GRID)(RawGrid);

export type TGridBodyProps = PartialKeys<TFullGridBodyProps, 'theme'>;
export const GridBody: React.ComponentClass<TGridBodyProps> = withTheme(GRID)(RawGridBody);

export type TGridHeadProps = PartialKeys<TFullGridHeadProps, 'theme'>;
export const GridHead: React.ComponentClass<TGridHeadProps> = withTheme(GRID)(RawGridHead);

export type TGridRowProps = PartialKeys<TFullGridRowProps, 'theme'>;
export const GridRow: React.ComponentClass<TGridRowProps> = withTheme(GRID)(RawGridRow);

export type TGridCellProps = PartialKeys<TFullGridCellProps, 'theme'>;
export const GridCell: React.ComponentClass<TGridCellProps> = withTheme(GRID)(RawGridCell);
