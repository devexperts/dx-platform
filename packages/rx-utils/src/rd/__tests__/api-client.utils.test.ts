import { fakeServer } from 'sinon';
import { ApiClient } from '../api-client.utils';
import { pending, isSuccess, isFailure } from '@devexperts/remote-data-ts';

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

	describe('content type header is not provided', () => {
		it('application/json should be set as default', () => {
			const client = ApiClient.create('/');
			const sub$ = client
				.request({
					method: 'POST',
					url: 'test',
				})
				.subscribe();

			const request = server.requests[0];
			expect(request.requestHeaders['Content-Type']).toBe('application/json;charset=utf-8');
			sub$.unsubscribe();
		});
	});

	describe('content type header is provided through constructor parameter', () => {
		it('should override the default header', () => {
			const client = ApiClient.create('/', { 'Content-Type': 'text/plain;charset=utf-8' });
			const sub$ = client
				.request({
					method: 'POST',
					url: 'test',
				})
				.subscribe();

			const request = server.requests[0];
			expect(request.requestHeaders['Content-Type']).toBe('text/plain;charset=utf-8');
			sub$.unsubscribe();
		});
	});

	describe('content type header is provided through AjaxRequest', () => {
		it('should override the default and extra header', () => {
			const client = ApiClient.create('/', { 'Content-Type': 'text/plain;charset=utf-8' });
			const sub$ = client
				.request({
					method: 'POST',
					url: 'test',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
				})
				.subscribe();

			const request = server.requests[0];
			expect(request.requestHeaders['Content-Type']).toBe('application/x-www-form-urlencoded;charset=utf-8');
			sub$.unsubscribe();
		});
	});

	describe('AjaxRequest headers', () => {
		it('should replace matched headers but preserve others', () => {
			const client = ApiClient.create('/', { 'First-Header': 'first', 'Second-Header': 'second' });
			const sub$ = client
				.request({
					method: 'POST',
					url: 'test',
					headers: { 'Second-Header': 'secondEx' },
				})
				.subscribe();

			const request = server.requests[0];
			expect(request.requestHeaders).toEqual({
				'Content-Type': 'application/json;charset=utf-8',
				'First-Header': 'first',
				'Second-Header': 'secondEx',
			});
			sub$.unsubscribe();
		});
	});

	describe('body is string', () => {
		it('should be serialized without additional quotes', () => {
			const client = ApiClient.create('/');
			const sub$ = client
				.request({
					method: 'POST',
					url: 'test',
					body: 'string',
				})
				.subscribe();

			const request = server.requests[0];
			expect(request.requestBody).toBe('string');
			sub$.unsubscribe();
		});
	});

	describe('body is object with application/json header', () => {
		it('should be serialized as json string', () => {
			const client = ApiClient.create('/');
			const sub$ = client
				.request({
					method: 'POST',
					url: 'test',
					body: { testField1: 'testData1', testField2: 'testData2' },
				})
				.subscribe();

			const request = server.requests[0];
			expect(request.requestBody).toBe('{"testField1":"testData1","testField2":"testData2"}');
			sub$.unsubscribe();
		});
	});

	describe('body is object with application/x-www-form-urlencoded header', () => {
		it('should be serialized as encoded query string', () => {
			const client = ApiClient.create('/');
			const sub$ = client
				.request({
					method: 'POST',
					url: 'test',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: { testField1: 'testData1', testField2: 'testData2' },
				})
				.subscribe();

			const request = server.requests[0];
			expect(request.requestBody).toBe('testField1=testData1&testField2=testData2');
			sub$.unsubscribe();
		});
	});
});
