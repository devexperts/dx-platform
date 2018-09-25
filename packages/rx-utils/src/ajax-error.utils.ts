import { AjaxError } from 'rxjs/ajax';

export const isAjaxError = (error: Error): error is AjaxError => error instanceof AjaxError;
