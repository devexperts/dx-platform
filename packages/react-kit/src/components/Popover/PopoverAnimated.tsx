import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

import { TFullPopoverProps, Popover } from './Popover';

type TPopoverTransitionsTheme = {
	init?: string;
	duration?: string;
	appear?: string;
	appearActive?: string;
	enter?: string;
	enterActive?: string;
	enterDone?: string;
	exit?: string;
	exitActive?: string;
	exitDone?: string;
};

export type TPopoverAnimatedProps = TFullPopoverProps & {
	transitions: TPopoverTransitionsTheme;
};

export const PopoverAnimated = ({transitions, isOpened, ...props}: TPopoverAnimatedProps) => {
	const duration = parseInt(transitions.duration || '', 10) || 0;

	return (
		<CSSTransition
			// appear={true}
			// mountOnEnter={true}
			unmountOnExit={true}
			in={isOpened}
			timeout={duration}
			classNames={transitions}
			>
			{
				(state) => {
					console.warn({ state });
					return (
						<Popover
							isOpened={true}
							className={state === 'exited' && transitions.exitDone || ''}
							{...props}
						/>
					);
				}
			}
		</CSSTransition>
	);
}
