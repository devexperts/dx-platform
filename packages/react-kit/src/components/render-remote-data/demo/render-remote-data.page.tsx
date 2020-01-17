import { storiesOf } from '@storybook/react';
import { getRenderRemoteData } from '../get-render-remote-data';
import React from 'react';
import { Fragment, SFC } from 'react';
import { failure, pending, success } from '@devexperts/remote-data-ts';
import Demo from '../../demo/Demo';

const DataStatePending = () => <div>pending</div>;
const DataStateFailure: SFC<{ error: Error }> = props => <div>error: {props.error.message}</div>;
const DataStateNoData = () => <div>no data</div>;

const RenderRemoteData = getRenderRemoteData({
	DataStatePending,
	DataStateNoData,
	DataStateFailure,
});

const renderSuccess = (data: string) => <div>{data}</div>;

storiesOf('RenderRemoteData', module).add('default', () => (
	<Fragment>
		<Demo>
			<RenderRemoteData success={renderSuccess} data={pending} />
		</Demo>
		<Demo>
			<RenderRemoteData success={renderSuccess} data={success('success')} />
		</Demo>
		<Demo>
			<RenderRemoteData success={renderSuccess} data={failure(new Error('some test error'))} />
		</Demo>
		<Demo>
			<RenderRemoteData success={renderSuccess} data={success('')} noData={data => !data} />
		</Demo>
	</Fragment>
));
