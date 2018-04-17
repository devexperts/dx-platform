import * as React from 'react';
import { Moment } from 'moment';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import { PURE } from '../../utils/pure';
import { TCalendarTheme } from './Calendar.types';
import { ObjectClean } from 'typelevel-ts';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';

export const CALENDAR_HEADER = Symbol('CalendarHeader');

export type TFullCalendarHeaderProps = {
	value: Moment,
	onChange: any,
	locale: string,
	headerDateFormat: string,
	previousMonthIcon: React.ReactElement<any>,
	nextMonthIcon: React.ReactElement<any>,
	theme: TCalendarTheme
}

@PURE
class RawCalendarHeader extends React.Component<TFullCalendarHeaderProps> {
	render() {
		const {
			theme,
			value,
			headerDateFormat,
			previousMonthIcon,
			nextMonthIcon,
		} = this.props;

		const changeMonthBtnTheme = {
			container: theme.changeMonth__container,
			icon: theme.changeMonth__icon
		};

		const headerDate = value.format(headerDateFormat);
		return (
			<div className={theme.header}>
				<ButtonIcon icon={previousMonthIcon} theme={changeMonthBtnTheme} onClick={this.onChangeMonth(-1)}/>
				<span className={theme.header__text}>{headerDate}</span>
				<ButtonIcon icon={nextMonthIcon} theme={changeMonthBtnTheme} onClick={this.onChangeMonth(1)}/>
			</div>
		);
	}

	onChangeMonth = (step: number) => () => {
		const {value, onChange} = this.props;
		onChange && onChange(value.clone().add(step, 'months'));
	}
}

export type TCalendarHeaderProps = ObjectClean<PartialKeys<TFullCalendarHeaderProps, 'theme'>>;
export const CalendarHeader: React.ComponentClass<TCalendarHeaderProps> = withTheme(CALENDAR_HEADER)(RawCalendarHeader);
