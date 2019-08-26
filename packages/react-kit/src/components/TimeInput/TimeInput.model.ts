import { getEq, Option, some, map, alt, getOrElse } from 'fp-ts/lib/Option';
import { getStructEq, Eq, eqNumber } from 'fp-ts/lib/Eq';
import { eqUnknown } from '@devexperts/utils/dist/typeclasses/eq/eq.utils';
import { pipe } from 'fp-ts/lib/pipeable';

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

const eqPeriodType: Eq<PeriodType> = eqUnknown;

const eqOptionNumber = getEq(eqNumber);
const eqOptionPeriodType = getEq(eqPeriodType);

const eqTimeInputValue = getStructEq<TTimeInputValue>({
	hours: eqOptionNumber,
	minutes: eqOptionNumber,
	seconds: eqOptionNumber,
	periodType: eqOptionPeriodType,
});

export const isTimesDifferent = (x: TTimeInputValue, y: TTimeInputValue): boolean => {
	return !eqTimeInputValue.equals(x, y);
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
	return pipe(
		a,
		map(a => {
			const rawResult = (a + b) % (max + 1);
			return rawResult < 0 ? rawResult + max + 1 : rawResult;
		}),
		alt(() => some(b < 0 ? max : 0)),
	);
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
	const periodTypeNormalized = getOrElse(() => PeriodType.AM)(periodType);
	switch (periodTypeNormalized) {
		case PeriodType.AM:
			return some(PeriodType.PM);
		case PeriodType.PM:
			return some(PeriodType.AM);
	}
}

export const renderSection: (time: Option<string>) => string = getOrElse(() => EMPTY_SECTION);
