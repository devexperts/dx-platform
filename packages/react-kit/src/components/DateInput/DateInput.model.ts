import { Option, getSetoid, some, option } from 'fp-ts/lib/Option';
import { setoidNumber, getRecordSetoid } from 'fp-ts/lib/Setoid';
import { liftA3 } from 'fp-ts/lib/Apply';

export type TDateInputValue = {
	day: Option<number>;
	month: Option<number>;
	year: Option<number>;
};

const setoidOptionNumber = getSetoid(setoidNumber);
const dateSetoid = getRecordSetoid<TDateInputValue>({
	day: setoidOptionNumber,
	month: setoidOptionNumber,
	year: setoidOptionNumber,
});

export const isDatesDifferent = (x: TDateInputValue, y: TDateInputValue): boolean => !dateSetoid.equals(x, y);

export const buildDate = (day: number) => (month: number) => (year: number) => new Date(year, month, day);
export const buildDateOption = liftA3(option)(buildDate);

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
	return date.foldL(
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
	);
}

export function decrementMonth(month: number): number {
	if (month >= 0 && month <= 11) {
		return (month - 1 + 12) % 12;
	}
	return 11;
}

export function decrementMonthOption(month: Option<number>): Option<number> {
	return month.map(decrementMonth).alt(some(11));
}

export function incrementMonth(month: number): number {
	if (month >= 0 && month <= 11) {
		return (month + 1) % 12;
	}
	return 0;
}

export function incrementMonthOption(month: Option<number>): Option<number> {
	return month.map(incrementMonth).alt(some(0));
}
