import * as React from 'react';
import { Transition } from 'react-transition-group';
import * as classnames from 'classnames';

import { PURE } from '../../utils/pure';
import { TFullPopoverProps, Popover } from './Popover';

type TPopoverTransitionsTheme = {
	init?: string;
	duration?: string;
	exited?: string;
	exiting?: string;
	entering?: string;
	entered?: string;
};

export type TPopoverAnimatedProps = TFullPopoverProps & {
	transitions: TPopoverTransitionsTheme;
};

@PURE
export class PopoverAnimated extends React.Component<TPopoverAnimatedProps> {
	render() {
		const { transitions = {}, isOpened, theme, ...props } = this.props;
		const duration = parseInt(transitions.duration || '', 10) || 0;
		return (
			<Transition appear={true} mountOnEnter={true} unmountOnExit={true} in={isOpened} timeout={duration}>
				{state => (
					<Popover
						isOpened={true}
						theme={{
							...theme,
							container: classnames(theme.container, transitions.init, transitions[state]),
						}}
						{...props}
					/>
				)}
			</Transition>
		);
	}
}
