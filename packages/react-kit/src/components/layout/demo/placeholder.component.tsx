import React from 'react';
import theme from './placeholder.component.styl';

type TPlaceholderProps = {
	className: string;
	isMaximized: boolean;
	fits: boolean;
};

const iconTheme = {
	container: theme.icon,
};

export const Placeholder: React.SFC<TPlaceholderProps> = props => {
	const { className, fits, isMaximized } = props;

	return (
		<div className={className}>
			{!fits && 'X'}
			{isMaximized && <div className={theme.hint}>Maximized</div>}
		</div>
	);
};
