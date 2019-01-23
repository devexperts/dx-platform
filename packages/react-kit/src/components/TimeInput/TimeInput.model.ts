import { getSetoid, Option } from 'fp-ts/lib/Option';
import { getRecordSetoid, Setoid, setoidNumber, strictEqual } from 'fp-ts/lib/Setoid';

export type TTimeInputValue = {
	hours: Option<number>;
	minutes: Option<number>;
	seconds: Option<number>;
	periodType: Option<PeriodType>;
};

export enum PeriodType {
	AM,
	PM,
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

export const formatValue = (sectionValue: number | PeriodType, section: Section) => {
	switch (section) {
		//maybe we should use left-pad here? ;)
		case Section.Minutes: //fallthrough
		case Section.Hours: //fallthrough
		case Section.Seconds: {
			if (sectionValue < 10) {
				return `0${sectionValue}`;
			}
			return `${sectionValue}`;
		}
		case Section.PeriodType: {
			return periodTypeToString(sectionValue);
		}
	}
};

const periodTypeToString = (periodType: PeriodType): string => {
	switch (periodType) {
		case PeriodType.AM:
			return 'am';
		case PeriodType.PM:
			return 'pm';
	}
};
