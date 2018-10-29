import { Option, getSetoid, some, option } from 'fp-ts/lib/Option';
import { setoidNumber, getRecordSetoid } from 'fp-ts/lib/Setoid';
import { TPopoverProps } from '../Popover/Popover';
import { TButtonIconProps } from '../ButtonIcon/ButtonIcon';
import { TControlProps } from '../Control/Control';
import { TSteppableInputProps } from '../SteppableInput/SteppableInput';
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

const buildDate = (day: number) => (month: number) => (year: number) => new Date(year, month, day);
export const buildDateOption = liftA3(option)(buildDate);

export enum DateFormatType {
	MDY,
	DMY,
}

export type TCalendarProps = TControlProps<Date | null> & {
	onMouseDown?: React.EventHandler<React.MouseEvent<Element>>;
	min?: Date;
	max?: Date;
};

type TDateValueProps = TControlProps<TDateInputValue>;

export type TDateInputOwnProps = TSteppableInputProps &
	TDateValueProps & {
	min?: Date;
	max?: Date;
	calendarIcon?: React.ReactElement<any>;
	onClear?: Function;
	onFocus?: () => void;
	onBlur?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	target?: Element;
	Calendar?: React.ComponentClass<TCalendarProps> | React.SFC<TCalendarProps>;
};

type TDateDefaultProps = {
	SteppableInput: React.ComponentClass<TSteppableInputProps> | React.SFC<TSteppableInputProps>;
	ButtonIcon: React.ComponentClass<TButtonIconProps>;
	Popover: React.ComponentClass<TPopoverProps> | React.SFC<TPopoverProps>;
	dateFormatType: DateFormatType;
};

export type TDateInputInjectedProps = {
	theme: {
		inner?: string;
		inner_isFilled?: string;
		section?: string;
		section_isActive?: string;
		separator?: string;
		SteppableInput?: TSteppableInputProps['theme'];
		ButtonIcon?: TButtonIconProps['theme'];
		CalendarButtonIcon?: TButtonIconProps['theme'];
		Popover?: TPopoverProps['theme'];
	};
};

export type TDateInputFullProps = TDateInputOwnProps & TDateInputInjectedProps & TDateDefaultProps;

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
