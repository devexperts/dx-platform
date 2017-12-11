import React from 'react';
import Demo from '../demo/Demo';
import { Button } from '../Button/Button';
import { Popover, PopoverPlacement, PopoverAlign } from './Popover';
import { Selectbox } from '../Selectbox/Selectbox';
import { MenuItem } from '../Menu/Menu';
import { PURE } from '@devexperts/utils/lib/react/pure';
import { storiesOf } from '@devexperts/tools/utils/storybook';
import {stateful} from '../Control/Control';

import css from './Popover.page.styl';

const buttonTheme = {
	container: css.toggleButton
};

@PURE
class HeavyContent extends React.Component<{isLong?: boolean}> {

	render() {
		return (
			<div>
				<h2>Tethered Content</h2>
				<p>A paragraph to accompany the title.</p>
				<p>A paragraph to accompany the title.</p>
				<p>A paragraph to accompany the title.</p>
				<p>A paragraph to accompany the title.</p>
				<p>A paragraph to accompany the title.</p>
				{this.props.isLong && (
					<div>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
						<p>A paragraph to accompany the title.</p>
					</div>
				)}
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
		isLongText: false,
		closeOnClickAway: false
	};

	_anchor: any;

	render() {
		const { placement, align, isOpened, closeOnClickAway } = this.state;

		return (
			<Demo>
				<div className={css.container}>
					<div>
						<label className={css.label}>Placement</label>
						<Stateful defaultValue={PopoverPlacement.Bottom}
						          onValueChange={this.onPlacementSelect}>
							<MenuItem value={PopoverPlacement.Top}>Top</MenuItem>
							<MenuItem value={PopoverPlacement.Bottom}>Bottom</MenuItem>
							<MenuItem value={PopoverPlacement.Left}>Left</MenuItem>
							<MenuItem value={PopoverPlacement.Right}>Right</MenuItem>
						</Stateful>
						<label className={css.label}>Align</label>
						{(placement === PopoverPlacement.Top || placement === PopoverPlacement.Bottom) && (
							<Stateful defaultValue={PopoverAlign.Left}
							          onValueChange={this.onAlignSelect}>
								<MenuItem value={PopoverAlign.Left}>Left</MenuItem>
								<MenuItem value={PopoverAlign.Center}>Center</MenuItem>
								<MenuItem value={PopoverAlign.Right}>Right</MenuItem>
							</Stateful>
						)}
						{(placement === PopoverPlacement.Left || placement === PopoverPlacement.Right) && (
							<Stateful defaultValue={PopoverAlign.Top}
							          onValueChange={this.onAlignSelect}>
								<MenuItem value={PopoverAlign.Top}>Top</MenuItem>
								<MenuItem value={PopoverAlign.Middle}>Middle</MenuItem>
								<MenuItem value={PopoverAlign.Bottom}>Bottom</MenuItem>
							</Stateful>
						)}
						<label className={css.label}>
							Close on clickaway <input type="checkbox"
							                          value={closeOnClickAway.toString()}
							                          onChange={this.onCloseOnClickAwayChange}/>
						</label>
					</div>
					<Button isPrimary={true}
					        onClick={this.onToggleClick}
					        ref={el => this._anchor = el}
					        theme={buttonTheme}>
						{isOpened ? 'Hide' : 'Open'}
						<Popover placement={placement}
						         isOpened={isOpened}
						         onRequestClose={this.onPopoverRequestClose}
						         closeOnClickAway={closeOnClickAway}
						         hasArrow={true}
						         align={align}
						         anchor={this._anchor}>
							<HeavyContent/>
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
				align: PopoverAlign.Top
			});
		} else if (!placementWasVertical && placementWillBeVertical) {
			//placement orientation changed from horizontal to vertical
			//choose default horizontal align
			this.setState({
				align: PopoverAlign.Left
			});
		}
		//finally set placement
		this.setState({
			placement
		});
	}

	onAlignSelect = (align: PopoverPlacement) => {
		this.setState({
			align
		});
	}

	onToggleClick = () => {
		this.setState({
			isOpened: !this.state.isOpened
		});
	}

	onPopoverRequestClose = () => {
		this.setState({
			isOpened: false
		});
	}

	onCloseOnClickAwayChange = () => {
		this.setState({
			closeOnClickAway: !this.state.closeOnClickAway
		});
	}
}

storiesOf('Popover', module).add('default', () => (
	<PopoverPage/>
));