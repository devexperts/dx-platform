import { getSetoid, Option } from 'fp-ts/lib/Option';
import { getRecordSetoid, setoidNumber, setoidString } from 'fp-ts/lib/Setoid';

export type TTimeOption = {
	hours: Option<number>;
	minutes: Option<number>;
	seconds: Option<number>;
	periodType: Option<string>;
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

const setoidOptionNumber = getSetoid(setoidNumber);
const setoidOptionString = getSetoid(setoidString);

const timeSetoid = getRecordSetoid<TTimeOption>({
	hours: setoidOptionNumber,
	minutes: setoidOptionNumber,
	seconds: setoidOptionNumber,
	periodType: setoidOptionString,
});

export const isTimesDifferent = (x: TTimeOption, y: TTimeOption): boolean => {
	return !timeSetoid.equals(x, y);
};
