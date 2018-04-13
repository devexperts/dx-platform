import * as React from 'react';
import * as classnames from 'classnames';
import { PURE } from '../../utils/pure';
import { TCalendarTheme } from './Calendar.types';
import { Button } from '../Button/Button';
import { Moment } from 'moment';

export type TFullDayProps = {
	value: Moment,
	onChange: any,
	dayFormat: string,
	isDisabled: boolean,
	isCurrent: boolean,
	isSelected: boolean,
	theme: TCalendarTheme
}

@PURE
export default class Day extends React.Component<TFullDayProps> {
	static defaultProps = {
		isDisabled: false,
		isCurrent: false,
		isSelected: false
	}

	render() {
		const {
			theme,
			value,
			dayFormat,
			isCurrent,
			isDisabled,
			isSelected
		} = this.props;

		const btnTheme = {
			container: classnames(theme.day, {
				[theme.day_disabled as string]: isDisabled,
				[theme.day_current as string]: isCurrent && !isDisabled,
				[theme.day_selected as string]: isSelected && !isDisabled
			})
		};

		return (
			<Button theme={btnTheme}
					onMouseDown={this.onMouseDown}
					isDisabled={isDisabled}
					isFlat={true}
					type="button">
				{value.format(dayFormat)}
			</Button>
		);
	}

	onMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		this.props.onChange(this.props.value.format());
	}
}