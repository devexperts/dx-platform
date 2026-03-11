import { PureComponent, SFC } from 'react';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { withRX } from '../with-rx2';
import { Subject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { constUndefined } from 'fp-ts/lib/function';

describe('withRX2', () => {
	let scheduler: TestScheduler;
	beforeEach(() => {
		scheduler = new TestScheduler((a, b) => expect(a).toEqual(b));
	});
	afterEach(() => {
		scheduler.flush();
		cleanup();
	});

	type FooProps = {
		foo: string;
	};
	it.skip('should pass observable value into props', async () => {
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
		const FooContainer = withRX(Foo)(
			() => ({
				props: {
					foo: foo$,
				},
			}),
			{ scheduler },
		);
		render(<FooContainer foo={'initial'} />);
		scheduler.expectObservable(result$).toBe(timeline.res);
		scheduler.flush();
	});
	it.skip('should pass handlers', () => {
		type Props = { foo: string; handler: (arg: string) => void };
		class Foo extends PureComponent<Props> {
			render() {
				return <div id={'id'} onClick={() => this.props.handler(this.props.foo)} />;
			}
		}
		const handler = jest.fn();
		const FooContainer = withRX(Foo)(() => ({ defaultProps: { handler } }));
		const { container } = render(<FooContainer foo={'test'} />);
		const div = container.querySelector('#id')!;
		userEvent.click(div);
		expect(handler).toHaveBeenCalledWith('test');
	});
	it.skip('should pass defaultValues', () => {
		const Foo: SFC<FooProps> = props => <div id={'foo'}>{props.foo}</div>;
		const FooContainer = withRX(Foo)(() => ({ defaultProps: { foo: 'default' } }));
		const { container } = render(<FooContainer />);
		const fooDiv = container.querySelector('#foo')!;
		expect(fooDiv.textContent).toBe('default');
	});
	it.skip('should immediately unsubscribe on unmount', () => {
		const Foo: SFC<FooProps> = props => <div id={'foo'}>{props.foo}</div>;
		const foo$ = scheduler.createHotObservable<string>('^-a-b-|');
		const FooContainer = withRX(Foo)(
			props$ => ({
				props: {
					foo: foo$,
				},
			}),
			{ scheduler },
		);
		const { unmount } = render(<FooContainer foo={'initial'} />);
		unmount();
		scheduler.expectSubscriptions(foo$.subscriptions).toBe('(^!)');
	});
	it('should run effects', () => {
		const Foo = () => <div />;
		const timeline = {
			src: '-a-b-|',
			res: '-a-b-|',
		};
		const effects$ = scheduler.createColdObservable(timeline.src);
		const FooContainer = withRX(Foo)(
			() => ({
				effects$,
			}),

			{ scheduler },
		);
		render(<FooContainer />);
		scheduler.expectObservable(effects$).toBe(timeline.res);
		scheduler.flush();
	});
	it.skip('should immediately unsubscribe from effects on unmount', () => {
		const Foo = () => <div />;
		const effects$ = scheduler.createColdObservable('-a-b-|');
		const FooContainer = withRX(Foo)(() => ({ effects$ }), { scheduler });
		const { unmount } = render(<FooContainer />);
		unmount();
		scheduler.expectSubscriptions(effects$.subscriptions).toBe('(^!)');
	});
	it('should typecheck', () => {
		type Props = {
			foo: string;
			bar: number;
			handler: (arg: number) => void;
		};
		const Foo: SFC<Props> = () => <div>hi</div>;
		const C = withRX(Foo)(() => ({}), { scheduler });
		const C1 = withRX(Foo)(() => ({ defaultProps: { handler: constUndefined } }), { scheduler });
		const C2 = withRX(Foo)(() => ({ defaultProps: { foo: '123', adsfsd: 123 } }), { scheduler });
		const C3 = withRX(Foo)(() => ({ defaultProps: { foo: '123', bar: 213 } }), { scheduler });
		//argument inference is working
		const C4 = withRX(Foo)(() => ({ defaultProps: { handler(arg) {} } }), { scheduler });
		(() => [
			<C handler={constUndefined} foo={'123'} bar={123} />,
			<C1 foo={'123'} bar={123} />,
			<C1 foo={'123'} bar={123} handler={constUndefined} />,
			<C2 handler={constUndefined} bar={123} />,
			<C3 handler={constUndefined} />,
			<C4 foo={'123'} bar={123} />,
		])();
	});
});
