import { AjaxError } from 'rxjs/ajax';

/**
 * @deprecated
 */
export const isAjaxError = (error: Error): error is AjaxError => error instanceof AjaxError;
