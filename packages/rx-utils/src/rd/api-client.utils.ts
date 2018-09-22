import { RemoteData, pending, failure, success } from '@devexperts/remote-data-ts';
import * as qs from 'query-string';
import { map, catchError, startWith } from 'rxjs/operators';
import { ajax, AjaxError, AjaxRequest } from 'rxjs/ajax';
import { Observable, Subject, of } from 'rxjs';

export enum RequestMethod {
	Get = 'GET',
	Post = 'POST',
	Put = 'PUT',
	Delete = 'DELETE',
}

export class ApiClient {
	static create(baseHref: string, extraHeaders?: object) {
		return new ApiClient(baseHref, extraHeaders);
	}

	readonly RequestMethod = RequestMethod;

	private constructor(private readonly baseHref: string, private readonly headers?: object) {}

	private createURL(url: string, query?: {}): string {
		return query ? `${url}?${qs.stringify(query)}` : url;
	}

	private readonly errorSubj$ = new Subject<AjaxError>();

	readonly error$ = this.errorSubj$.asObservable();

	readonly request = <Response = never>(request: AjaxRequest): Observable<RemoteData<AjaxError, Response>> => {
		const url = `${this.baseHref}${request.url}`;

		const xhr: AjaxRequest = {
			withCredentials: true,
			responseType: 'json',
			...request,
			headers: {
				'Content-Type': 'application/json; charset=UTF-8',
				...this.headers,
				...request.headers,
			},
			url,
		};

		return ajax(xhr).pipe(
			map(response => success<AjaxError, Response>(response.response)),
			catchError(response => {
				this.errorSubj$.next(response);

				return of(failure<AjaxError, Response>(response));
			}),
			startWith(pending),
		);
	};

	readonly get = <Response = never>(url: string, query?: {}): Observable<RemoteData<AjaxError, Response>> => {
		return this.request({
			url: this.createURL(url, query),
			method: this.RequestMethod.Get,
		});
	};

	readonly post = <Response = never>(url: string, body: {}): Observable<RemoteData<AjaxError, Response>> => {
		return this.request({
			url,
			method: this.RequestMethod.Post,
			body,
		});
	};

	readonly remove = <Response = never>(url: string, query = {}): Observable<RemoteData<AjaxError, Response>> => {
		return this.request({
			url: this.createURL(url, query),
			method: this.RequestMethod.Delete,
		});
	};

	readonly put = <Response = never>(url: string, body?: {}): Observable<RemoteData<AjaxError, Response>> => {
		return this.request({
			url,
			method: this.RequestMethod.Put,
			body,
		});
	};
}
