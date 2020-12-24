import { TestScheduler } from 'rxjs/testing';
import { EntityStore } from '../entity-store.utils';
import { RemoteData, success, pending, failure } from '@devexperts/remote-data-ts';
import { LiveData } from '../live-data.utils';

type TEntity = {
	id: number;
};

describe('EntityStore', () => {
	let scheduler: TestScheduler;
	let store: EntityStore<Error, TEntity>;
	beforeEach(() => {
		scheduler = new TestScheduler((a, b) => expect(a).toEqual(b));
		store = new EntityStore();
	});
	afterEach(() => {
		scheduler.flush();
	});

	const finalResult = success({ id: 1 });
	const getterValues: Record<string, RemoteData<Error, TEntity>> = {
		p: pending,
		s: finalResult,
		f: failure(new Error('some error')),
	};

	class TestGetter {
		count = 0;

		execute(
			marbles: string,
			values: Record<string, RemoteData<Error, TEntity>> = getterValues,
		): LiveData<Error, TEntity> {
			this.count++;
			return scheduler.createColdObservable<RemoteData<Error, TEntity>>(marbles, values);
		}
	}

	describe('get', () => {
		xit('should invoke getter when called for the first time for given key, later use values from the cache', () => {
			// @formatter:off
			//prettier-ignore
			const scheme = {
				src:  'p-s|------',
				sub1: '---------!',
				res1: 'p-s---------',
				sub2: '-----^---!',
				res2: '-----s------',
			};
			// @formatter:on

			const getter = new TestGetter();
			const result = store.get('x', () => getter.execute(scheme.src));
			scheduler.expectObservable(result, scheme.sub1).toBe(scheme.res1, getterValues);

			scheduler.schedule(() => {
				const result2 = store.get('x', () => getter.execute(scheme.src));
				scheduler.expectObservable(result2, scheme.sub2).toBe(scheme.res2, getterValues);
			}, 50);

			scheduler.flush();
			expect(getter.count).toEqual(1);
		});

		xit('should cancel the getter when the only subscriber leaves, and remove pending from cache', () => {
			// @formatter:off
			//prettier-ignore
			const scheme = {
				src:  'p---s|-------',
				sub1: '--!----------',
				res1: 'p------------',
				sub2: '-------^-----',
				res2: '-------p---s-'
			};
			// @formatter:on

			const getter = new TestGetter();
			const result = store.get('x', () => getter.execute(scheme.src));
			scheduler.expectObservable(result, scheme.sub1).toBe(scheme.res1, getterValues);

			scheduler.schedule(() => {
				const result2 = store.get('x', () => getter.execute(scheme.src));
				scheduler.expectObservable(result2, scheme.sub2).toBe(scheme.res2, getterValues);
			}, 70);

			scheduler.flush();
			expect(getter.count).toBe(2);
		});

		xit('should NOT cancel the getter if there are active subscriptions', () => {
			// @formatter:off
			//prettier-ignore
			const scheme = {
				src:  'p-----s|----',
				sub1: '----!-------',
				res1: 'p-----------',
				sub2: '--^---------',
				res2: '--p---s-----'
			};
			// @formatter:off

			const getter = new TestGetter();
			const result = store.get('x', () => getter.execute(scheme.src));
			scheduler.expectObservable(result, scheme.sub1).toBe(scheme.res1, getterValues);

			scheduler.schedule(() => {
				const result2 = store.get('x', () => getter.execute(scheme.src));
				scheduler.expectObservable(result2, scheme.sub2).toBe(scheme.res2, getterValues);
			}, 20);

			scheduler.flush();
			expect(getter.count).toBe(1);
		});
	});
});
