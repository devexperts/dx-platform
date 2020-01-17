import React from 'react';
import Demo from '../../demo/Demo';
import { Button } from '../../Button/Button';
import { Popover } from '../Popover';
import { PopoverPlacement, PopoverAlign } from '../Popover.model';
import { Selectbox } from '../../Selectbox/Selectbox';
import { MenuItem } from '../../Menu/Menu';
import { PURE } from '../../../utils/pure';
import { storiesOf } from '@storybook/react';
import { stateful } from '../../Control/Control';

import css from './theme/Popover.page.styl';
import { Scrollable } from '../../Scrollable/Scrollable';
import { InputWithPopoverPage } from './InputWithPopover.page';
import { FixedPopoverPage } from './FixedPopover.page';

const buttonTheme = {
	container: css.toggleButton,
};

@PURE
class HeavyContent extends React.Component<{ isLong?: boolean }> {
	render() {
		return (
			<div>
				<Scrollable>
					<div className={css.heavy}>
						<h2>Tethered Content</h2>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
					</div>
				</Scrollable>
			</div>
		);
	}
}

const Stateful = stateful()(Selectbox);
const StatefulOpened = stateful('isOpened', 'onToggle', 'defaultIsOpened')(Stateful);

@PURE
class PopoverPage extends React.Component {
	state = {
		placement: PopoverPlacement.Bottom,
		align: PopoverAlign.Left,
		isOpened: false,
		isLongText: false,
		closeOnClickAway: false,
	};

	_anchor: any;

	render() {
		const { placement, align, isOpened, closeOnClickAway } = this.state;

		return (
			<Demo>
				<div className={css.container}>
					<div>
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
						<label className={css.label}>
							Close on clickaway{' '}
							<input
								type="checkbox"
								value={closeOnClickAway.toString()}
								onChange={this.onCloseOnClickAwayChange}
							/>
						</label>
					</div>
					<Button
						isPrimary={true}
						onClick={this.onToggleClick}
						ref={el => (this._anchor = el)}
						theme={buttonTheme}>
						{isOpened ? 'Hide' : 'Open'}
						<Popover
							placement={placement}
							isOpened={isOpened}
							onRequestClose={this.onPopoverRequestClose}
							closeOnClickAway={closeOnClickAway}
							hasArrow={true}
							align={align}
							anchor={this._anchor}>
							<HeavyContent />
						</Popover>
					</Button>
				</div>
			</Demo>
		);
	}

	onPlacementSelect = (placement: PopoverPlacement) => {
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

	onAlignSelect = (align: PopoverPlacement) => {
		this.setState({
			align,
		});
	};

	onToggleClick = () => {
		this.setState({
			isOpened: !this.state.isOpened,
		});
	};

	onPopoverRequestClose = () => {
		this.setState({
			isOpened: false,
		});
	};

	onCloseOnClickAwayChange = () => {
		this.setState({
			closeOnClickAway: !this.state.closeOnClickAway,
		});
	};
}

storiesOf('Popover', module)
	.add('default', () => <PopoverPage />)
	.add('input with popover', () => <InputWithPopoverPage />)
	.add('fixed popover', () => <FixedPopoverPage />);
