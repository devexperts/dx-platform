import React from 'react';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { ComponentClass, ComponentType } from 'react';

import { withTheme } from '../../utils/withTheme';
import { LoadingIndicator, TLoadingIndicatorProps } from '../LoadingIndicator/LoadingIndicator';
import { PURE } from '../../utils/pure';
import cn from 'classnames';
import { withDefaults } from '../../utils/with-defaults';

export const LOADING_INDICATION = Symbol('LoadingIndicaton') as symbol;

export type TRawLoadingIndicatonProps = {
	isVisible?: boolean;
	LoadingIndicator: ComponentType<TLoadingIndicatorProps>;
	theme: {
		container?: string;
		container_isVisible?: string;
		container_isNotDisplay?: string;
		LoadingIndicator?: TLoadingIndicatorProps['theme'];
	};
	hideTimer?: number;
};

export type TRawLoadingIndicatonState = {
	isDisplay: boolean;
};

@PURE
class RawLoadingIndicaton extends React.Component<TRawLoadingIndicatonProps, TRawLoadingIndicatonState> {
	state = {
		isDisplay: true,
	};
	timer?: number;

	render() {
		const { theme, isVisible, LoadingIndicator } = this.props;
		const { isDisplay } = this.state;

		const className = cn(theme.container, {
			[theme.container_isVisible as string]: isVisible,
			[theme.container_isNotDisplay as string]: !isDisplay,
		});

		return (
			<div className={className}>
				<LoadingIndicator theme={theme.LoadingIndicator} />
			</div>
		);
	}

	componentDidMount() {
		const { isVisible, hideTimer } = this.props;

		if (hideTimer) {
			this.timeoutWorker(hideTimer, isVisible);
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	timeoutWorker(hideTimer: number, isVisible?: boolean) {
		if (!isVisible) {
			this.timer = window.setTimeout(this.setDisplayNone, hideTimer);
		} else {
			clearTimeout(this.timer);
			this.setState({
				isDisplay: true,
			});
		}
	}

	componentWillReceiveProps(nextProps: TRawLoadingIndicatonProps) {
		const { isVisible, hideTimer } = nextProps;

		if (hideTimer) {
			this.timeoutWorker(hideTimer, isVisible);
		}
	}

	setDisplayNone = () => {
		this.setState({
			isDisplay: false,
		});
	};
}

export type TLoadingIndicationProps = PartialKeys<TRawLoadingIndicatonProps, 'LoadingIndicator' | 'theme'>;
export const LoadingIndication: ComponentClass<TLoadingIndicationProps> = withTheme(LOADING_INDICATION)(
	withDefaults<TRawLoadingIndicatonProps, 'LoadingIndicator'>({
		LoadingIndicator,
	})(RawLoadingIndicaton),
);
