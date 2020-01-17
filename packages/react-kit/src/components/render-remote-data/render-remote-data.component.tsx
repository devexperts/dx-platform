import React from 'react';
import { ComponentType, Fragment, Component } from 'react';
import { isFailure, isPending, isSuccess, RemoteData } from '@devexperts/remote-data-ts';
import { isNotNullable } from '@devexperts/utils/dist/object/object';

export type TDataStateErrorMainProps<L> = {
	error: L;
};

export type TRenderRemoteDataStates<L> = {
	DataStateNoData: ComponentType;
	DataStateFailure: ComponentType<TDataStateErrorMainProps<L>>;
	DataStatePending: ComponentType;
};

export type TRenderRemoteDataMainProps<L, A> = {
	data: RemoteData<L, A>;
	success: (data: A) => JSX.Element;
	noData?: (data: A) => boolean;
};

export type TRenderRemoteDataProps<L, A> = TRenderRemoteDataStates<L> & TRenderRemoteDataMainProps<L, A>;

export class RenderRemoteData<L, A> extends Component<TRenderRemoteDataProps<L, A>> {
	public render() {
		const { data } = this.props;
		return (
			<Fragment>
				{isPending(data) && this.renderPending()}
				{isSuccess(data) && this.renderSuccess(data.value)}
				{isFailure(data) && this.renderFailure(data.error)}
			</Fragment>
		);
	}

	private renderPending() {
		const { DataStatePending } = this.props;
		return <DataStatePending />;
	}

	private renderSuccess(data: A) {
		const { noData, success, DataStateNoData } = this.props;
		if (isNotNullable(noData) && noData(data)) {
			return <DataStateNoData />;
		}
		return success(data);
	}

	private renderFailure(error: L) {
		const { DataStateFailure } = this.props;
		console.warn('[RemoteFailure]', error);
		return <DataStateFailure error={error} />;
	}
}
