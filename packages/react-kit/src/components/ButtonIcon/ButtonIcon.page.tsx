import * as React from 'react';
import { storiesOf } from '@devexperts/tools/dist/utils/storybook';
import { ButtonIcon } from './ButtonIcon';
import Demo from '../demo/Demo';
import { ListItemTickIcon } from '../../icons/list-item-tick-icon';
import * as css from './ButtonIcon.page.styl';

const buttonTheme = {
	container: css.button,
	icon: css.icon,
};

const icon = <ListItemTickIcon />;

storiesOf('ButtonIcon', module)
	.add('Default', () => {
		return (
			<Demo>
				<ButtonIcon icon={icon} theme={buttonTheme} />
			</Demo>
		);
	})
	.add('Flat', () => (
		<Demo>
			<ButtonIcon icon={icon} theme={buttonTheme} isFlat={true} />
		</Demo>
	))
	.add('Disabled', () => (
		<Demo>
			<ButtonIcon icon={icon} theme={buttonTheme} isFlat={true} />
		</Demo>
	));
