import { getSetoid, Option, some } from 'fp-ts/lib/Option';
import { getRecordSetoid, Setoid, setoidNumber, strictEqual } from 'fp-ts/lib/Setoid';

export type TTimeInputValue = {
	hours: Option<number>;
	minutes: Option<number>;
	seconds: Option<number>;
	periodType: Option<PeriodType>;
};

export enum PeriodType {
	AM = 'AM',
	PM = 'PM',
}

export enum Section {
	Hours,
	Minutes,
	Seconds,
	PeriodType,
}

export const MAX_VALID_MINS_AND_SEC = 59;
export const MAX_VALID_HOURS_FOR_24H_FORMAT = 23;
export const MAX_VALID_HOURS_FOR_12H_FORMAT = 12;
export const EMPTY_SECTION = '--';

const setoidStrict = { equals: strictEqual };
const setoidPeriodType: Setoid<PeriodType> = setoidStrict;

const setoidOptionNumber = getSetoid(setoidNumber);
const setoidOptionPeriodType = getSetoid(setoidPeriodType);

const timeSetoid = getRecordSetoid<TTimeInputValue>({
	hours: setoidOptionNumber,
	minutes: setoidOptionNumber,
	seconds: setoidOptionNumber,
	periodType: setoidOptionPeriodType,
});

export const isTimesDifferent = (x: TTimeInputValue, y: TTimeInputValue): boolean => {
	return !timeSetoid.equals(x, y);
};

export const formatNumericValue = (value: number): string => {
	if (value < 10) {
		return `0${value}`;
	}
	return `${value}`;
};

export const formatTimePeriod = (periodType: PeriodType): string => {
	switch (periodType) {
		case PeriodType.AM:
			return 'am';
		case PeriodType.PM:
			return 'pm';
	}
};

/**
 * Values can be zeros (start from 0). Max is included value.
 */
export function add(a: Option<number>, b: number, max: number): Option<number> {
	return a
		.map(a => {
			const rawResult = (a + b) % (max + 1);
			return rawResult < 0 ? rawResult + max + 1 : rawResult;
		})
		.alt(some(b < 0 ? max : 0));
}

export function isDefined<A>(value?: A): value is A {
	return typeof value !== 'undefined';
}

export function findActiveSectionOnKeyLeft(activeState?: Section, isSecondsExist?: boolean): Section {
	switch (activeState) {
		case Section.PeriodType: {
			return isSecondsExist ? Section.Seconds : Section.Minutes;
		}
		case Section.Seconds: {
			return Section.Minutes;
		}
		case Section.Minutes: {
			return Section.Hours;
		}
		default:
			return Section.Hours;
	}
}

export function findActiveSectionOnKeyRight(
	activeSection?: Section,
	isSecondsExist?: boolean,
	isClockFormatExist?: boolean,
): Section {
	switch (activeSection) {
		case Section.Hours: {
			return Section.Minutes;
		}
		case Section.Minutes: {
			if (isSecondsExist) {
				return Section.Seconds;
			} else if (isClockFormatExist) {
				return Section.PeriodType;
			} else {
				return Section.Minutes;
			}
		}
		case Section.Seconds: {
			return isClockFormatExist ? Section.PeriodType : Section.Seconds;
		}
		case Section.PeriodType: {
			return Section.PeriodType;
		}
		default:
			return Section.Hours;
	}
}

export function togglePeriodType(periodType: Option<PeriodType>): Option<PeriodType> {
	const periodTypeNormalized = periodType.getOrElse(PeriodType.AM);
	switch (periodTypeNormalized) {
		case PeriodType.AM:
			return some(PeriodType.PM);
		case PeriodType.PM:
			return some(PeriodType.AM);
	}
}
