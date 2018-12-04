import * as React from 'react';
import Demo from '../demo/Demo';
import { Button } from '../Button/Button';
import { Popover, PopoverPlacement, PopoverAlign } from './Popover';
import { PopoverAnimated } from './PopoverAnimated';
import { Selectbox } from '../Selectbox/Selectbox';
import { MenuItem } from '../Menu/Menu';
import { PURE } from '../../utils/pure';
import { storiesOf } from '@devexperts/tools/dist/utils/storybook';
import { stateful } from '../Control/Control';

import * as css from './Popover.page.styl';
import * as popoverTransitionsHeightTheme from '../Popover/Popover.transitions.styl';
import * as popoverTransitionsOpacityTheme from '../Popover/Popover.transitions-opacity.styl';
import * as popoverTheme from '../Popover/Popover.styl';
import { Scrollable } from '../Scrollable/Scrollable';

const buttonTheme = {
	container: css.toggleButton,
};

enum PopoverTransitionsNames {
	Height = 'Height',
	Opacity = 'Opacity',
}

const popoverTransitions = {
	[PopoverTransitionsNames.Height]: popoverTransitionsHeightTheme,
	[PopoverTransitionsNames.Opacity]: popoverTransitionsOpacityTheme,
}

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

@PURE
class PopoverPage extends React.Component {
	state = {
		placement: PopoverPlacement.Bottom,
		align: PopoverAlign.Left,
		isOpened: false,
		isOpenedPopoverAnimated: false,
		isLongText: false,
		closeOnClickAway: false,
		transitions: popoverTransitions.Height,
	};

	_anchor: any;
	__anchor: any;

	render() {
		const { placement, align, transitions, isOpened, isOpenedPopoverAnimated, closeOnClickAway } = this.state;

		return (
			<Demo>
				<div className={css.container}>
					<div>
						<label className={css.label}>Placement</label>
						<Stateful defaultValue={PopoverPlacement.Bottom} onValueChange={this.onPlacementSelect as any}>
							<MenuItem value={PopoverPlacement.Top}>Top</MenuItem>
							<MenuItem value={PopoverPlacement.Bottom}>Bottom</MenuItem>
							<MenuItem value={PopoverPlacement.Left}>Left</MenuItem>
							<MenuItem value={PopoverPlacement.Right}>Right</MenuItem>
						</Stateful>
						<label className={css.label}>Align</label>
						{(placement === PopoverPlacement.Top || placement === PopoverPlacement.Bottom) && (
							<Stateful defaultValue={PopoverAlign.Left} onValueChange={this.onAlignSelect as any}>
								<MenuItem value={PopoverAlign.Left}>Left</MenuItem>
								<MenuItem value={PopoverAlign.Center}>Center</MenuItem>
								<MenuItem value={PopoverAlign.Right}>Right</MenuItem>
							</Stateful>
						)}
						{(placement === PopoverPlacement.Left || placement === PopoverPlacement.Right) && (
							<Stateful defaultValue={PopoverAlign.Top} onValueChange={this.onAlignSelect as any}>
								<MenuItem value={PopoverAlign.Top}>Top</MenuItem>
								<MenuItem value={PopoverAlign.Middle}>Middle</MenuItem>
								<MenuItem value={PopoverAlign.Bottom}>Bottom</MenuItem>
							</Stateful>
						)}
						<label className={css.label}>Animation</label>
						<Stateful
							defaultValue={PopoverTransitionsNames.Height}
							onValueChange={this.onTransitionsSelect as any}>
							<MenuItem value={PopoverTransitionsNames.Height}>Height</MenuItem>
							<MenuItem value={PopoverTransitionsNames.Opacity}>Opacity</MenuItem>
						</Stateful>
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
						onClick={this.onTogglePopover}
						ref={el => (this._anchor = el)}
						theme={buttonTheme}>
						{isOpened ? 'Hide popover' : 'Open popover'}
						<Popover
							theme={popoverTheme}
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
					<Button
						isPrimary={true}
						onClick={this.onTogglePopoverAnimated}
						ref={el => (this.__anchor = el)}
						theme={buttonTheme}>
						{isOpenedPopoverAnimated ? 'Hide animated popover' : 'Open animated popover'}
						<PopoverAnimated
							theme={popoverTheme}
							transitions={transitions}
							placement={placement}
							isOpened={isOpenedPopoverAnimated}
							onRequestClose={this.onPopoverAnimatedRequestClose}
							closeOnClickAway={closeOnClickAway}
							hasArrow={true}
							align={align}
							anchor={this.__anchor}>
							<HeavyContent />
						</PopoverAnimated>
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

	onTransitionsSelect = (transitions: PopoverTransitionsNames) => {
		this.setState({
			transitions: popoverTransitions[transitions],
		});
	};

	onTogglePopover = () => {
		this.setState({
			isOpened: !this.state.isOpened,
		});
	};

	onTogglePopoverAnimated = () => {
		this.setState({
			isOpenedPopoverAnimated: !this.state.isOpenedPopoverAnimated,
		});
	};

	onPopoverRequestClose = () => {
		this.setState({
			isOpened: false,
		});
	};

	onPopoverAnimatedRequestClose = () => {
		this.setState({
			isOpenedPopoverAnimated: false,
		});
	};

	onCloseOnClickAwayChange = () => {
		this.setState({
			closeOnClickAway: !this.state.closeOnClickAway,
		});
	};
}

storiesOf('Popover', module).add('default', () => <PopoverPage />);
