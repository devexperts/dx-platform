import { storiesOf } from '@storybook/react';
import { getRenderRemoteData } from '../get-render-remote-data';
import * as React from 'react';
import { SFC } from 'react';
import { failure, success } from '@devexperts/remote-data-ts';

const DataStateError: SFC<{ error: Error }> = props => <div>error: {props.error.message}</div>;
const DataStateNoDate = () => <div>no data</div>;

const RenderRemoteData = getRenderRemoteData({
	DataStateNoData: DataStateNoDate,
	DataStateFailure: DataStateError,
});

const renderSuccess = (data: string) => <div>{data}</div>;

storiesOf('RenderRemoteData', module)
	.add('success', () => <RenderRemoteData success={renderSuccess} data={success('success')} />)
	.add('error', () => (
		<RenderRemoteData success={renderSuccess} data={failure<Error, string>(new Error('some test error'))} />
	))
	.add('no data', () => <RenderRemoteData success={renderSuccess} data={success('')} noData={data => !!data} />);
