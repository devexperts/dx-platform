import { fakeServer } from 'sinon';
import { ApiClient } from '../api-client.utils';
import { pending, isSuccess, isFailure } from '@devexperts/utils/dist/rd';

describe('API Client', () => {
	let server = fakeServer.create();

	beforeEach(() => {
		server.restore();
		server = fakeServer.create();
	});

	afterEach(() => {
		server.restore();
	});

	describe('static #create', () => {
		it('should create instance with baseHref and extraHeaders', () => {
			const client = ApiClient.create('context', { 'X-FOO': 'test' });

			const sub$ = client
				.request({
					method: 'GET',
					url: '',
				})
				.subscribe();

			const request = server.requests[0];
			expect(request.url).toBe('context');
			expect(request.requestHeaders['X-FOO']).toBe('test');

			sub$.unsubscribe();
		});
	});

	describe('#request', () => {
		it('should return stream of remote data', () => {
			const client = ApiClient.create('/');

			const items1: any[] = [];
			const items2: any[] = [];

			client.request({ method: 'GET', url: '' }).subscribe(item => items1.push(item));
			client.request({ method: 'GET', url: '' }).subscribe(item => items2.push(item));

			expect(items1[0]).toEqual(pending);
			expect(items2[0]).toEqual(pending);

			const [req1, req2] = server.requests;

			req1.respond(200, {}, JSON.stringify({}));
			req2.respond(404, {}, '');

			expect(isSuccess(items1[1])).toBeTruthy();
			expect(isFailure(items2[1])).toBeTruthy();
		});
	});

	describe('shorthands: get, post, put, remove', () => {
		it('should use $request method with predefined parameters', () => {
			const client = ApiClient.create('/');
			const spy = jest.spyOn(client, 'request');

			client.get('test', { foo: 'bar' });

			expect(spy).toHaveBeenCalledWith({
				method: 'GET',
				url: 'test?foo=bar',
			});

			spy.mockReset();

			client.post('test', {
				foo: 'bar',
			});

			expect(spy).toHaveBeenCalledWith({
				method: 'POST',
				url: 'test',
				body: {
					foo: 'bar',
				},
			});

			spy.mockReset();

			client.put('test', {
				foo: 'bar',
			});

			expect(spy).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'test',
				body: {
					foo: 'bar',
				},
			});

			spy.mockReset();

			client.remove('test', {
				foo: 'bar',
			});

			expect(spy).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'test?foo=bar',
			});
		});
	});
});
