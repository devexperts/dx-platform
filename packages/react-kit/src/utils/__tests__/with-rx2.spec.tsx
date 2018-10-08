import { SFC } from 'react';
import * as React from 'react';
import { mount } from 'enzyme';
import { withRX } from '../with-rx2';
import { Subject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { mapTo } from 'rxjs/operators';

describe('withRX2', () => {
	let scheduler: TestScheduler;
	beforeEach(() => {
		scheduler = new TestScheduler((a, b) => expect(a).toEqual(b));
	});
	afterEach(() => {
		scheduler.flush();
	});

	type FooProps = {
		foo: string;
	};
	it('should pass observable value into props', async () => {
		const timeline = {
			src: '^-a-b-|',
			res: '--a-b--',
		};
		const foo$ = scheduler.createHotObservable<string>(timeline.src);
		const result$ = new Subject<string>();
		const Foo: SFC<FooProps> = props => {
			result$.next(props.foo);
			return <div>{props.foo}</div>;
		};
		const FooContainer = withRX(
			Foo,
			(props$, select) =>
				select({
					foo: foo$,
				}),
			{},
			scheduler,
		);
		const foo = mount(<FooContainer foo={'initial'} />);
		scheduler.expectObservable(result$).toBe(timeline.res);
		scheduler.flush();
		foo.unmount();
	});
	it('should pass defaultValues', () => {
		const Foo: SFC<FooProps> = props => <div id={'foo'}>{props.foo}</div>;
		const FooContainer = withRX(Foo, (props$, select) => select({}), {
			foo: 'default',
		});
		const foo = mount(<FooContainer />);
		expect(foo.find('#foo').text()).toBe('default');
		foo.unmount();
	});
	it('should immediately unsubscribe on unmount', () => {
		const Foo: SFC<FooProps> = props => <div id={'foo'}>{props.foo}</div>;
		const foo$ = scheduler.createHotObservable<string>('^-a-b-|');
		const FooContainer = withRX(
			Foo,
			(props$, select) =>
				select({
					foo: foo$,
				}),
			{},
			scheduler,
		);
		const foo = mount(<FooContainer foo={'initial'} />);
		foo.unmount();
		scheduler.expectSubscriptions(foo$.subscriptions).toBe('(^!)');
	});
	it('should run effects', () => {
		const Foo = () => <div />;
		const timeline = {
			src: '-a-b-|',
			res: '-a-b-|',
		};
		const effects$ = scheduler.createColdObservable(timeline.src).pipe(mapTo(undefined));
		const FooContainer = withRX(Foo, (props$, select) => select({}, effects$), {}, scheduler);
		const foo = mount(<FooContainer />);
		scheduler.expectObservable(effects$).toBe(timeline.res, { a: undefined, b: undefined });
		scheduler.flush();
		foo.unmount();
	});
	it('should immediately unsubscribe from effects on unmount', () => {
		const Foo = () => <div />;
		const effects$ = scheduler.createColdObservable('-a-b-|');
		const FooContainer = withRX(
			Foo,
			(props$, select) => select({}, effects$.pipe(mapTo(undefined))),
			{},
			scheduler,
		);
		const foo = mount(<FooContainer />);
		foo.unmount();
		scheduler.expectSubscriptions(effects$.subscriptions).toBe('(^!)');
	});
});
