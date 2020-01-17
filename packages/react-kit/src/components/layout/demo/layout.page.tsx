import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from '../layout.component';
import {
	ItemSide,
	LayoutModelItemType,
	LayoutOrientation,
	TDenormalizedLayout,
	TLayoutStructure,
	TMinimumLayoutModelItemProps,
} from '../layout.constants';
import { storiesOf } from '@storybook/react';
import { uuid } from '@devexperts/utils/dist/string/string';
import { prepareLayout, setDragData } from '../layout.utils';
import { DNDContext } from '../dnd-context';

import css from './layout.page.styl';
import { reducer, insertNativeAt } from '../layout.redux';
import { Button } from '../../Button/Button';
import { Demo } from '../../demo/Demo';
import layoutCss from './layout.styl';
import scrollableCss from './scrollable.styl';
import { mergeThemes } from '../../../utils/withTheme';

const theme = {
	container: css.container,
};

const layoutTheme = mergeThemes(
	{
		item: css.layout__item,
		placeholder: css.layout__placeholder,
		placeholder_fits: css.layout__placeholder_fits,
		placeholder_maximized: css.layout__placeholder_maximized,
		resizeHandler: css.resizeHandler,
	},
	layoutCss,
	{
		Scrollable: scrollableCss,
	},
);

const prevent = (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault();

const demoPlaceholder: any = (props: any) => {
	const { className, fits, isMaximized } = props;
	return (
		<div className={className}>
			{!fits && 'X'}
			{isMaximized && (
				<div className={css.placeholder__hint}>
					Chart widget is in maximized mode.
					<small>Exit maximized mode to add new widgets to workspace</small>
				</div>
			)}
		</div>
	);
};

class DemoItem extends React.Component<any, any> {
	static contextTypes = {
		handleMaximizeClick: PropTypes.func,
		checkIsWidgetMaximized: PropTypes.func,
	};

	render() {
		//eslint-disable-next-line
		const { color, id, connectDragSource, onRemove } = this.props;
		const { handleMaximizeClick, checkIsWidgetMaximized } = (this as any).context; // TODO: context must be here, but typescript complains! research!

		const isMaximized = checkIsWidgetMaximized(id);

		const style = {
			backgroundColor: color,
		};
		const removeTheme = {
			container: css.item__remove,
		};

		const actions = (
			<div className={css.item__actions}>
				<Button onMouseDown={prevent} onClick={handleMaximizeClick(id)} theme={removeTheme}>
					M
				</Button>
				{!isMaximized && (
					<Button onMouseDown={prevent} onClick={onRemove} theme={removeTheme}>
						X
					</Button>
				)}
			</div>
		);

		return (
			<div style={style} className={css.item}>
				{connectDragSource &&
					connectDragSource(
						<div className={css.item__dragHandler}>
							<span>Drag Me</span>
							{actions}
						</div>,
						{
							dropEffect: 'none',
						},
					)}
				{!connectDragSource && (
					<div className={css.item__dragHandler}>
						<span>{isMaximized ? "I'm maximized" : 'Try to Drag Me'}</span>
						{actions}
					</div>
				)}
			</div>
		);
	}
}

const minWidth = 500; //px
const minHeight = 125; //px

type DemoItemProps = TMinimumLayoutModelItemProps & {
	color: string;
};
const layout: TDenormalizedLayout<DemoItemProps> = {
	id: 'root',
	size: 1,
	orientation: LayoutOrientation.Horizontal,
	items: [
		{
			id: 'left',
			props: {
				color: 'lightgrey',
				minWidth,
				minHeight,
			},
			size: 0.5,
		},
		{
			id: 'right',
			size: 0.5,
			orientation: LayoutOrientation.Vertical,
			items: [
				{
					id: uuid(),
					props: {
						color: 'yellow',
						minWidth,
						minHeight,
					},
					size: 0.25,
				},
				{
					id: uuid(),
					props: {
						color: 'blue',
						minWidth,
						minHeight,
					},
					size: 0.25,
				},
			],
		},
	],
};

const value = prepareLayout(layout);

//make only top level layout a dnd context
const DNDLayout = DNDContext(Layout) as typeof Layout;

type TLayoutPageState = {
	value: TLayoutStructure<TMinimumLayoutModelItemProps>;
	isFixed: boolean;
	maximizedId?: string;
	root?: string;
	side?: string;
	color: string;
};

class LayoutStory extends React.Component<{}, TLayoutPageState> {
	//noinspection JSDuplicatedDeclaration

	static childContextTypes = {
		handleMaximizeClick: PropTypes.func,
		checkIsWidgetMaximized: PropTypes.func,
	};

	getChildContext() {
		return {
			handleMaximizeClick: this.handleMaximizeClick,
			checkIsWidgetMaximized: this.checkIsWidgetMaximized,
		};
	}

	state: TLayoutPageState = {
		value,
		side: 'Right',
		isFixed: false,
		color: 'darkred',
	};

	render() {
		const { value } = this.state;
		let items = Object.keys(value.items);

		items = items.filter(item => {
			return item !== value.root_id;
		});

		return (
			<Demo theme={theme}>
				<div>
					<div className={css.toolbar}>
						<div className={css.toolbarControl}>
							<label className={css.label}>
								<input className={css.checkbox} type="checkbox" onChange={this.onCheckboxChange} />
								<span>isFixed</span>
							</label>
						</div>
						<div className={css.toolbarControl}>
							<Button onClick={this.handleClearLayout} isPrimary={true}>
								Clear layout
							</Button>
						</div>
						<div className={css.toolbarAddItem}>
							<label>Items</label>
							<select onChange={this.onHandleItem} value={this.state.root}>
								<option key={0} value="" />
								{items.map((item, index) => {
									return (
										<option key={index + 1} value={item}>
											{item}
										</option>
									);
								})}
							</select>
							<label>Side</label>
							<select onChange={this.onHandleSide} value={this.state.side}>
								<option value="Top">Top</option>
								<option value="Bottom">Bottom</option>
								<option value="Left">Left</option>
								<option value="Right">Right</option>
							</select>
							<label>Color</label>
							<input type="text" onChange={this.onHandleInputColor} />
							<Button onClick={this.insertItem}>Add Item</Button>
						</div>
					</div>
					<ul className={css.draggableItems}>
						<li draggable={true} className={css.draggableItem} onDragStart={this.onDragStart('green')}>
							green
						</li>
						<li draggable={true} onDragStart={this.onDragStart('magenta')} className={css.draggableItem}>
							magenta
						</li>
						<li draggable={true} onDragStart={this.onDragStart('yellow')} className={css.draggableItem}>
							yellow
						</li>
						<li draggable={true} onDragStart={this.onDragStart('blue')} className={css.draggableItem}>
							blue
						</li>
						<li draggable={true} onDragStart={this.onDragStart('cyan')} className={css.draggableItem}>
							cyan
						</li>
					</ul>
					<section className={css.layoutContainer}>
						<DNDLayout
							theme={layoutTheme}
							ItemComponent={DemoItem}
							Placeholder={demoPlaceholder}
							debounceResize={70}
							isFixed={this.state.isFixed}
							maximizedId={this.state.maximizedId}
							value={this.state.value}
							onChange={this.onChange}
							itemPropsFactory={(data: unknown) => ({
								...(data as object),
								minWidth,
								minHeight,
							})}
							minItemWidth={minWidth}
							minItemHeight={minHeight}
							resizeHandlerSize={10}
						/>
					</section>
				</div>
			</Demo>
		);
	}

	onHandleItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({
			root: e.target.value,
		});
	};

	onHandleSide = (e: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({
			side: e.target.value,
		});
	};

	onHandleInputColor = (e: any) => {
		this.setState({
			color: e.target.value,
		});
	};

	insertItem = () => {
		const { value, root, side, color } = this.state;
		let newSide = ItemSide.Top;

		switch (side) {
			case 'Top':
				newSide = ItemSide.Top;
				break;
			case 'Bottom':
				newSide = ItemSide.Bottom;
				break;
			case 'Left':
				newSide = ItemSide.Left;
				break;
			case 'Right':
				newSide = ItemSide.Right;
				break;
		}

		if (root) {
			const newValue = reducer(
				value,
				insertNativeAt<DemoItemProps>(
					{
						color,
						minWidth,
						minHeight,
					},
					root,
					newSide,
				),
			);
			console.log(newValue);
			this.setState({
				value: newValue,
			});
		}
	};

	handleClearLayout = () => {
		this.setState({
			maximizedId: void 0,
			value: prepareLayout({
				...layout,
				items: [],
			}),
		});
	};

	handleMaximizeClick = (id: string) => (e: any) => {
		const { maximizedId } = this.state;
		this.setState({
			maximizedId: maximizedId ? void 0 : id,
		});
	};

	onChange = (value: TLayoutStructure<TMinimumLayoutModelItemProps>) => {
		const items = Object.keys(value.items).reduce((acc: any, id: string) => {
			let item = value.items[id];
			if (item.type === LayoutModelItemType.Plain) {
				item = {
					...item,
					props: {
						...item.props,
					},
				};
			}
			return {
				...acc,
				[id]: item,
			};
		}, {});

		this.setState({
			value: {
				...value,
				items,
			},
		});
	};

	checkIsWidgetMaximized = (id: string) => {
		return id === this.state.maximizedId;
	};

	onCheckboxChange = () => {
		this.setState({
			isFixed: !this.state.isFixed,
		});
	};

	onDragStart = (color: string) => (e: React.DragEvent) => {
		setDragData<DemoItemProps>(e.nativeEvent, {
			color,
			minWidth,
			minHeight,
		});
	};
}

storiesOf('Layout', module).add('default', () => <LayoutStory />);
