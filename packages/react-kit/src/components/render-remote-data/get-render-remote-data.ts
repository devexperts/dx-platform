import {
	RenderRemoteData,
	TDataStateErrorMainProps,
	TRenderRemoteDataMainProps,
	TRenderRemoteDataProps,
	TRenderRemoteDataStates,
} from './render-remote-data.component';
import { ComponentType, createElement } from 'react';

export const getRenderRemoteData = <L, FP extends TDataStateErrorMainProps<L>>(
	dataStates: TRenderRemoteDataStates<L, FP>,
) => <D>(props: TRenderRemoteDataMainProps<L, D>) => {
	const rrdProps: TRenderRemoteDataProps<L, D, FP> = { ...dataStates, ...props };
	const Target: ComponentType<TRenderRemoteDataProps<L, D, FP>> = RenderRemoteData;

	return createElement(Target, rrdProps);
};
