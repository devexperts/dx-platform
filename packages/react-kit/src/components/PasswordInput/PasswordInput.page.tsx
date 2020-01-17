import React from 'react';
import Demo from '../demo/Demo';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { PasswordInput } from './PasswordInput';
import { PURE } from '../../utils/pure';

import css from './PasswordInput.page.styl';

import { ShowPasswordIcon } from '../../icons/show-password-icon';
import { HidePasswordIcon } from '../../icons/hide-password-icon';

const darkDemoTheme = {
	container: css.container,
};

@PURE
class PasswordInputPage extends React.Component {
	state = {
		value: 'test',
		isRevealed: false,
	};

	render() {
		const { isRevealed } = this.state;
		return (
			<Demo theme={darkDemoTheme}>
				<main>
					<section className={css.form}>
						<PasswordInput
							onValueChange={this.onChange}
							IconShow={ShowPasswordIcon}
							value={this.state.value}
							onReveal={this.onReveal}
							isRevealed={isRevealed}
							IconHide={HidePasswordIcon}
						/>
					</section>
				</main>
			</Demo>
		);
	}

	onChange = (value?: string) => {
		action('value changed')(value);

		this.setState({
			value,
		});
	};

	onReveal = (isRevealed: boolean) => {
		action('isRevealed changed')(isRevealed);
		this.setState({
			isRevealed,
		});
	};
}

storiesOf('PasswordInput', module).add('default', () => <PasswordInputPage />);
