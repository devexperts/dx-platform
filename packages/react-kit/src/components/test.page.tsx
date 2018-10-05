import * as React from 'react';
import { PureComponent } from 'react';
import { withRX } from '../utils/with-rx';
import { interval } from 'rxjs';
import { storiesOf } from '@storybook/react';

type FooProps = {
	foo: string;
	bar: number;
};
class Foo extends PureComponent<FooProps> {
	render() {
		const { foo, bar } = this.props;
		return (
			<div>
				{foo}, {bar}
			</div>
		);
	}
}

const FooContainer = withRX(
	Foo,
	(props$, select) =>
		select({
			bar: interval(1000),
		}),
	{
		bar: 12334234234,
	},
);

storiesOf('Test', module).add('default', () => (
	<div>
		<FooContainer foo={'123'} />
	</div>
));
