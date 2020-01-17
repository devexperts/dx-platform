import React from 'react';
import { PURE } from '../../utils/pure';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { ComponentClass } from 'react';

export const LOADING_INDICATOR = Symbol('LoadingIndicator') as symbol;

export type TFullLoadingIndicatorProps = {
	theme: {
		container?: string;
	};
};

@PURE
class RawLoadingIndicator extends React.Component<TFullLoadingIndicatorProps> {
	render() {
		const { theme } = this.props;

		return <div className={theme.container} />;
	}
}

export type TLoadingIndicatorProps = PartialKeys<TFullLoadingIndicatorProps, 'theme'>;
export const LoadingIndicator: ComponentClass<TLoadingIndicatorProps> = withTheme(LOADING_INDICATOR)(
	RawLoadingIndicator,
);
