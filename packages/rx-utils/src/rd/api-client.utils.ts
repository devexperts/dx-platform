import { RemoteData } from '@devexperts/remote-data-ts';
import * as qs from 'query-string';
import { of } from 'rxjs/observable/of';
import { ajax } from 'rxjs/observable/dom/ajax';
import { pending, failure, success } from '@devexperts/utils/dist/rd';
import { AjaxRequest } from 'rxjs/observable/dom/AjaxObservable';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/startWith';

export enum RequestMethod {
	Get = 'GET',
	Post = 'POST',
	Put = 'PUT',
	Delete = 'DELETE',
}

export class ApiClient<TError> {
	static create(baseHref: string, extraHeaders?: object) {
		return new ApiClient(baseHref, extraHeaders);
	}

	readonly RequestMethod = RequestMethod;

	private constructor(private readonly baseHref: string, private readonly headers?: object) {}

	private createURL(url: string, query?: {}): string {
		return query ? `${url}?${qs.stringify(query)}` : url;
	}

	private readonly errorSubj$ = new Subject<TError>();

	readonly error$ = this.errorSubj$.asObservable();

	readonly request = <Response = never>(request: AjaxRequest): Observable<RemoteData<TError, Response>> => {
		const url = `${this.baseHref}${request.url}`;

		const xhr: AjaxRequest = {
			withCredentials: true,
			responseType: 'json',
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				...this.headers,
			},
			...request,
			url,
			body: request.body && JSON.stringify(request.body),
		};

		return ajax(xhr)
			.map(response => success<TError, Response>(response.response))
			.catch(response => {
				this.errorSubj$.next(response);

				return of(failure<TError, Response>(response));
			})
			.startWith<RemoteData<TError, Response>>(pending);
	};

	readonly get = <Response = never>(url: string, query?: {}): Observable<RemoteData<TError, Response>> => {
		return this.request({
			url: this.createURL(url, query),
			method: this.RequestMethod.Get,
		});
	};

	readonly post = <Response = never>(url: string, body: {}): Observable<RemoteData<TError, Response>> => {
		return this.request({
			url,
			method: this.RequestMethod.Post,
			body,
		});
	};

	readonly remove = <Response = never>(url: string, query = {}): Observable<RemoteData<TError, Response>> => {
		return this.request({
			url: this.createURL(url, query),
			method: this.RequestMethod.Delete,
		});
	};

	readonly put = <Response = never>(url: string, body?: {}): Observable<RemoteData<TError, Response>> => {
		return this.request({
			url,
			method: this.RequestMethod.Put,
			body,
		});
	};
}
