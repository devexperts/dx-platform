import React from 'react';
import { Popup } from './Popup';
import { storiesOf } from '@storybook/react';
import { PURE } from '../../utils/pure';
import Demo from '../demo/Demo';
import { Button } from '../Button/Button';
import { Selectbox } from '../Selectbox/Selectbox';
import { stateful } from '../Control/Control';
import { MenuItem } from '../Menu/Menu';

import css from './Popup.page.styl';

const theme = {
	container: css.container,
};

const popupTheme = {
	container: css.popup,
};

const header = <div>HEADER</div>;

const footer = <div>FOOTER</div>;

const Stateful = stateful()(Selectbox);
const StatefulOpened = stateful('isOpened', 'onToggle')(Stateful);

@PURE
class PopupPage extends React.Component {
	state = {
		isOpened: false,
		isModal: false,
		shouldCloseOnClickAway: false,
	};

	componentDidMount() {
		const html = document.querySelector('html');
		if (html) {
			html.classList.add(css.html);
		}
	}

	componentWillUnmount() {
		const html = document.querySelector('html');
		if (html) {
			html.classList.remove(css.html);
		}
	}

	render() {
		const { isOpened, isModal, shouldCloseOnClickAway } = this.state;

		return (
			<Demo theme={theme}>
				<label className={css.label}>
					Modal <input type="checkbox" value={isModal.toString()} onChange={this.onIsModalChange} />
				</label>
				<label className={css.label}>
					Close on clickaway{' '}
					<input
						type="checkbox"
						value={shouldCloseOnClickAway.toString()}
						onChange={this.onCloseOnClickAwayChange}
					/>
				</label>
				{!isModal && shouldCloseOnClickAway && (
					<label className={css.label}>
						When isModal === false && shouldCloseOnClickAway === true popup will close on click inside inner
						selectbox, because there is no backdrop and selectbox is rendered to body
					</label>
				)}
				<Button isPrimary={true} onClick={this.onToggleClick}>
					{isOpened ? 'Close' : 'Open'}
					<Popup
						theme={popupTheme}
						header={header}
						footer={footer}
						isModal={isModal}
						shouldCloseOnClickAway={shouldCloseOnClickAway}
						onRequestClose={this.onPopupRequestClose}
						isOpened={isOpened}>
						<div>popup content</div>
						<StatefulOpened defaultValue={undefined} placeholder="Choose your hero">
							<MenuItem value="superman">Superman</MenuItem>
							<MenuItem value="batman">Batman</MenuItem>
							<MenuItem value="flash">Flash</MenuItem>
						</StatefulOpened>
					</Popup>
				</Button>
			</Demo>
		);
	}

	onToggleClick = () => {
		this.setState({
			isOpened: !this.state.isOpened,
		});
	};

	onIsModalChange = () => {
		this.setState({
			isModal: !this.state.isModal,
		});
	};

	onCloseOnClickAwayChange = () => {
		this.setState({
			shouldCloseOnClickAway: !this.state.shouldCloseOnClickAway,
		});
	};

	onPopupRequestClose = () => {
		this.setState({
			isOpened: false,
		});
	};
}

storiesOf('Popup', module).add('Default', () => <PopupPage />);
