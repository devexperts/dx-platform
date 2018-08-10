import * as React from 'react';
import { ComponentType, Fragment, Component } from 'react';
import { RemoteData } from '@devexperts/remote-data-ts';
import { isNotNullable } from '@devexperts/utils/dist/object';

export type TDataStateErrorMainProps<L> = {
	error: L;
};

export type TRenderRemoteDataStates<L, FP extends TDataStateErrorMainProps<L>> = {
	DataStateNoData: ComponentType;
	DataStateFailure: ComponentType<FP>;
};

export type TRenderRemoteDataMainProps<L, D> = {
	data: RemoteData<L, D>;
	success: (data: D) => JSX.Element;
	noData?: (data: D) => boolean;
};

export type TRenderRemoteDataProps<L, D, FP extends TDataStateErrorMainProps<L>> = TRenderRemoteDataStates<L, FP> &
	TRenderRemoteDataMainProps<L, D>;

export class RenderRemoteData<L, D, FP extends TDataStateErrorMainProps<L>> extends Component<
	TRenderRemoteDataProps<L, D, FP>
> {
	public render() {
		const { data } = this.props;
		return (
			<Fragment>
				{data.isSuccess() && this.renderSuccess(data.value)}
				{data.isFailure() && this.renderFailure(data.error)}
			</Fragment>
		);
	}

	private renderSuccess = (data: D) => {
		const { noData, success, DataStateNoData } = this.props;
		if (isNotNullable(noData) && noData(data)) {
			return <DataStateNoData />;
		}
		return success(data);
	};

	private renderFailure = (error: L) => {
		const { DataStateFailure } = this.props;
		console.warn('[RemoteFailure]', error);
		return <DataStateFailure error={error} />;
	};
}
