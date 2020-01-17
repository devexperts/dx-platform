import React from 'react';
import Demo from '../../demo/Demo';
import { PURE } from '../../../utils/pure';
import { Button } from '../../Button/Button';
import { Popover } from '../Popover';
import { PopoverPlacement, PopoverAlign } from '../Popover.model';
import { Scrollable } from '../../Scrollable/Scrollable';
import css from './theme/Popover.page.styl';
import { stateful } from '../../Control/Control';
import { Selectbox } from '../../Selectbox/Selectbox';
import { MenuItem } from '../../Menu/Menu';
import cn from 'classnames';

const Stateful = stateful()(Selectbox);
const StatefulOpened = stateful('isOpened', 'onToggle', 'defaultIsOpened')(Stateful);

const scrollableTheme = {
	container: css.scrollable,
};

enum VericalButtonPosition {
	Top,
	Middle,
	Bottom,
}

enum HorizontalButtonPosition {
	Left,
	Center,
	Right,
}

type TFixedPopoverPageState = Readonly<{
	isOpened: boolean;
	placement: PopoverPlacement;
	align: PopoverAlign;
	verticalButtonPosition: VericalButtonPosition;
	horizontalButtonPosition: HorizontalButtonPosition;
}>;

@PURE
export class FixedPopoverPage extends React.Component<{}, TFixedPopoverPageState> {
	private anchor: any;
	private block: any;

	readonly state: TFixedPopoverPageState = {
		isOpened: false,
		placement: PopoverPlacement.Bottom,
		align: PopoverAlign.Left,
		horizontalButtonPosition: HorizontalButtonPosition.Center,
		verticalButtonPosition: VericalButtonPosition.Middle,
	};

	render() {
		const { isOpened, placement, align, horizontalButtonPosition, verticalButtonPosition } = this.state;
		const wrapperClassName = cn(css.wrapper, {
			[css.wrapperLeft as string]: horizontalButtonPosition === HorizontalButtonPosition.Left,
			[css.wrapperCenter as string]: horizontalButtonPosition === HorizontalButtonPosition.Center,
			[css.wrapperRight as string]: horizontalButtonPosition === HorizontalButtonPosition.Right,
			[css.wrapperTop as string]: verticalButtonPosition === VericalButtonPosition.Top,
			[css.wrapperMiddle as string]: verticalButtonPosition === VericalButtonPosition.Middle,
			[css.wrapperBottom as string]: verticalButtonPosition === VericalButtonPosition.Bottom,
		});
		return (
			<Demo>
				<div>
					<div className={css.controls}>
						<div className={css.popoverControls}>
							<label className={css.label}>Placement</label>
							<StatefulOpened
								defaultIsOpened={false}
								defaultValue={PopoverPlacement.Bottom}
								onValueChange={this.onPlacementSelect as any}>
								<MenuItem value={PopoverPlacement.Top}>Top</MenuItem>
								<MenuItem value={PopoverPlacement.Bottom}>Bottom</MenuItem>
								<MenuItem value={PopoverPlacement.Left}>Left</MenuItem>
								<MenuItem value={PopoverPlacement.Right}>Right</MenuItem>
							</StatefulOpened>
							<label className={css.label}>Align</label>
							{(placement === PopoverPlacement.Top || placement === PopoverPlacement.Bottom) && (
								<StatefulOpened
									defaultIsOpened={false}
									defaultValue={PopoverAlign.Left}
									onValueChange={this.onAlignSelect as any}>
									<MenuItem value={PopoverAlign.Left}>Left</MenuItem>
									<MenuItem value={PopoverAlign.Center}>Center</MenuItem>
									<MenuItem value={PopoverAlign.Right}>Right</MenuItem>
								</StatefulOpened>
							)}
							{(placement === PopoverPlacement.Left || placement === PopoverPlacement.Right) && (
								<StatefulOpened
									defaultIsOpened={false}
									defaultValue={PopoverAlign.Top}
									onValueChange={this.onAlignSelect as any}>
									<MenuItem value={PopoverAlign.Top}>Top</MenuItem>
									<MenuItem value={PopoverAlign.Middle}>Middle</MenuItem>
									<MenuItem value={PopoverAlign.Bottom}>Bottom</MenuItem>
								</StatefulOpened>
							)}
						</div>
						<div>
							<label className={css.label}>Horizontal Button Position</label>
							<StatefulOpened
								defaultIsOpened={false}
								defaultValue={HorizontalButtonPosition.Center}
								onValueChange={this.onHorizontalAlignSelect as any}>
								<MenuItem value={HorizontalButtonPosition.Left}>Left</MenuItem>
								<MenuItem value={HorizontalButtonPosition.Center}>Center</MenuItem>
								<MenuItem value={HorizontalButtonPosition.Right}>Right</MenuItem>
							</StatefulOpened>
							<label className={css.label}>Vertical Button Position</label>
							<StatefulOpened
								defaultIsOpened={false}
								defaultValue={VericalButtonPosition.Middle}
								onValueChange={this.onVerticalAlignSelect as any}>
								<MenuItem value={VericalButtonPosition.Top}>Top</MenuItem>
								<MenuItem value={VericalButtonPosition.Middle}>Middle</MenuItem>
								<MenuItem value={VericalButtonPosition.Bottom}>Bottom</MenuItem>
							</StatefulOpened>
						</div>
					</div>
					<Scrollable theme={scrollableTheme}>
						<div ref={el => (this.block = el)}>
							<div className={wrapperClassName}>
								<Button isPrimary={true} onClick={this.onToggle} ref={el => (this.anchor = el)}>
									Target
								</Button>
								{isOpened && (
									<Popover
										container={this.block}
										anchor={this.anchor}
										isOpened={true}
										closeOnClickAway={true}
										disableCloseOnScroll={true}
										onRequestClose={this.onPopoverRequestClose}
										hasArrow={true}
										placement={placement}
										align={align}>
										<div>popover content</div>
									</Popover>
								)}
							</div>
						</div>
					</Scrollable>
				</div>
			</Demo>
		);
	}

	private onToggle = () => {
		this.setState({
			isOpened: !this.state.isOpened,
		});
	};

	private onPopoverRequestClose = () => {
		this.setState({ isOpened: false });
	};

	private onPlacementSelect = (placement: PopoverPlacement) => {
		const placementWasVertical = [PopoverPlacement.Top, PopoverPlacement.Bottom].includes(this.state.placement);
		const placementWillBeVertical = [PopoverPlacement.Top, PopoverPlacement.Bottom].includes(placement);
		if (placementWasVertical && !placementWillBeVertical) {
			//placement orientation changed from vertical to horizontal
			//choose default vertical align
			this.setState({
				align: PopoverAlign.Top,
			});
		} else if (!placementWasVertical && placementWillBeVertical) {
			//placement orientation changed from horizontal to vertical
			//choose default horizontal align
			this.setState({
				align: PopoverAlign.Left,
			});
		}
		//finally set placement
		this.setState({
			placement,
		});
	};

	private onAlignSelect = (align: PopoverAlign) => {
		this.setState({
			align,
		});
	};

	private onHorizontalAlignSelect = (horizontalButtonPosition: HorizontalButtonPosition) => {
		this.setState({
			horizontalButtonPosition,
		});
	};

	private onVerticalAlignSelect = (verticalButtonPosition: VericalButtonPosition) => {
		this.setState({
			verticalButtonPosition,
		});
	};
}
