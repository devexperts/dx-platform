import * as React from 'react';
import { Moment } from 'moment';
import {ButtonIcon} from '../ButtonIcon/ButtonIcon';
import { PURE } from '../../utils/pure';
import { TCalendarTheme } from './Calendar.types';

export type TFullDayProps = {
	value: Moment,
	onChange: any,
	locale: string,
	headerDateFormat: string,
	previousMonthIcon:  React.ComponentClass<any> | React.StatelessComponent<any>,,
	nextMonthIcon:  React.ComponentClass<any> | React.StatelessComponent<any>,,
	theme: TCalendarTheme
}

@PURE
export default class CalendarHeader extends React.Component<TFullDayProps> {
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

