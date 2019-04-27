import {
	RenderRemoteData,
	TRenderRemoteDataMainProps,
	TRenderRemoteDataProps,
	TRenderRemoteDataStates,
} from './render-remote-data.component';
import { ComponentType, createElement } from 'react';

export const getRenderRemoteData = <L>(dataStates: TRenderRemoteDataStates<L>) => <A>(
	props: TRenderRemoteDataMainProps<L, A> & Partial<TRenderRemoteDataStates<L>>,
) => {
	const rrdProps: TRenderRemoteDataProps<L, A> = { ...dataStates, ...props };
	const Target: ComponentType<TRenderRemoteDataProps<L, A>> = RenderRemoteData;

	return createElement(Target, rrdProps);
};
