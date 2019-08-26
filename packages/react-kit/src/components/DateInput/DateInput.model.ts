import { Option, getEq, some, map, alt, fold, ap } from 'fp-ts/lib/Option';
import { eqNumber, getStructEq } from 'fp-ts/lib/Eq';
import { pipe } from 'fp-ts/lib/pipeable';
import { constant } from 'fp-ts/lib/function';

export type TDateInputValue = {
	day: Option<number>;
	month: Option<number>;
	year: Option<number>;
};

const eqOptionNumber = getEq(eqNumber);
const eqDateInputValue = getStructEq<TDateInputValue>({
	day: eqOptionNumber,
	month: eqOptionNumber,
	year: eqOptionNumber,
});

export const isDatesDifferent = (x: TDateInputValue, y: TDateInputValue): boolean => !eqDateInputValue.equals(x, y);

export const buildDate = (day: number) => (month: number) => (year: number) => new Date(year, month, day);
export const buildDateOption = (day: Option<number>) => (month: Option<number>) => (
	year: Option<number>,
): Option<Date> => pipe(day, map(buildDate), ap(month), ap(year));

export enum DateFormatType {
	MDY,
	DMY,
}

export type TDateInputState = {
	activeSection?: ActiveSection;
	isOpened?: boolean;
};

export enum ActiveSection {
	Day,
	Month,
	Year,
}

export const toObjectDate = (date: Date): TDateInputValue => ({
	day: some(date.getDate()),
	month: some(date.getMonth()),
	year: some(date.getFullYear()),
});

export function format(date: Option<number>, section: ActiveSection): string {
	return pipe(
		date,
		fold(
			() => {
				switch (section) {
					case ActiveSection.Day: {
						return 'dd';
					}
					case ActiveSection.Month: {
						return 'mm';
					}
					case ActiveSection.Year: {
						return 'yyyy';
					}
				}
			},
			value => {
				switch (section) {
					//maybe we should use left-pad here? ;)
					case ActiveSection.Day: //fallthrough
					case ActiveSection.Month: {
						//day and month are 2 digits
						return `${value >= 0 && value < 10 ? 0 : ''}${value}`;
					}
					case ActiveSection.Year: {
						if (value < 10) {
							return `000${value}`;
						} else if (value < 100) {
							return `00${value}`;
						} else if (value < 1000) {
							return `0${value}`;
						} else {
							return `${value}`;
						}
					}
				}
			},
		),
	);
}

export function decrementMonth(month: number): number {
	if (month >= 0 && month <= 11) {
		return (month - 1 + 12) % 12;
	}
	return 11;
}

export function decrementMonthOption(month: Option<number>): Option<number> {
	return pipe(month, map(decrementMonth), alt(constant(some(11))));
}

export function incrementMonth(month: number): number {
	if (month >= 0 && month <= 11) {
		return (month + 1) % 12;
	}
	return 0;
}

export function incrementMonthOption(month: Option<number>): Option<number> {
	return pipe(month, map(incrementMonth), alt(constant(some(0))));
}

export const inc = (value: number): number => value + 1;
