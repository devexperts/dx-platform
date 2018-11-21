import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { some, none } from 'fp-ts/lib/Option';
import { ReactRef } from '../../utils/typings';
import { DateInput } from './DateInput';
import { TDateInputValue, DateFormatType } from './DateInput.model';
import { SmallCrossIcon as ClearIcon } from '../../icons/small-cross-icon';
import { Button } from '../Button/Button';
import { AddIcon } from '../../icons/add-icon';
import { DecreaseIcon } from '../../icons/decrease-icon';

const CLEARED_DATE = { day: none, month: none, year: none };

type TDateRangeState = Readonly<{
	startDateValue: TDateInputValue;
	endDateValue: TDateInputValue;
	isStartDateFocused: boolean;
	isEndDateFocused: boolean;
}>;

type TDateRangeProps = {
	dateFormatType: DateFormatType;
	isDisabled: boolean;
	error: boolean;
};

export class DateRange extends React.Component<TDateRangeProps, TDateRangeState> {
	private endDateInput: ReactRef<HTMLElement> | null = null;

	readonly state: TDateRangeState = {
		startDateValue: { day: some(1), month: some(1), year: some(2018) },
		endDateValue: { day: some(1), month: some(1), year: some(2018) },
		isStartDateFocused: false,
		isEndDateFocused: false,
	};

	render() {
		const { isDisabled, error, dateFormatType } = this.props;
		const { startDateValue, endDateValue } = this.state;

		return (
			<div>
				<section onKeyPress={this.onKeyPress}>
					<h1>Controlled date range without calendar</h1>
					<DateInput
						dateFormatType={dateFormatType}
						onValueChange={this.onStartDateChange}
						clearIcon={<ClearIcon />}
						incrementIcon={<AddIcon />}
						decrementIcon={<DecreaseIcon />}
						onClear={this.onStartDateClear}
						error={error}
						value={startDateValue}
						onFocus={this.onStartDateFocus}
						onBlur={this.onStartDateBlur}
						isDisabled={isDisabled}
					/>
					<DateInput
						dateFormatType={dateFormatType}
						onValueChange={this.onEndDateChange}
						clearIcon={<ClearIcon />}
						incrementIcon={<AddIcon />}
						decrementIcon={<DecreaseIcon />}
						onClear={this.onEndDateClear}
						error={error}
						value={endDateValue}
						innerRef={this.getEndDateRef}
						onFocus={this.onEndDateFocus}
						onBlur={this.onEndDateBlur}
						isDisabled={isDisabled}
					/>
					<Button onClick={this.onStartDateManualClear}>Clear</Button>
					<Button onClick={this.onEndDateManualClear}>Clear</Button>
				</section>
			</div>
		);
	}

	private onStartDateFocus = () => this.setState({ isStartDateFocused: true });
	private onEndDateFocus = () => this.setState({ isEndDateFocused: true });
	private onStartDateBlur = () => this.setState({ isStartDateFocused: false });
	private onEndDateBlur = () => this.setState({ isEndDateFocused: false });

	private onKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
		if (e.charCode === 13) {
			if (this.state.isStartDateFocused && this.endDateInput) {
				this.onFocus(this.endDateInput);
			}
			if (this.state.isEndDateFocused && this.endDateInput) {
				this.onBlur(this.endDateInput);
			}
		}
	};

	private getEndDateRef = (input: ReactRef<HTMLElement>): void => {
		this.endDateInput = input;
	};

	private onFocus = (reference: React.ReactInstance) => {
		const element = findDOMNode(reference) as HTMLElement;
		if (element) {
			element.focus();
		}
	};

	private onBlur = (reference: React.ReactInstance) => {
		const element = findDOMNode(reference) as HTMLElement;
		if (element) {
			element.blur();
		}
	};

	private onStartDateManualClear = () => {
		this.setState({
			startDateValue: CLEARED_DATE,
		});
	};

	private onEndDateManualClear = () => {
		this.setState({
			endDateValue: CLEARED_DATE,
		});
	};

	private onStartDateClear = () => {
		this.setState({
			startDateValue: CLEARED_DATE,
		});
	};

	private onEndDateClear = () => {
		this.setState({
			endDateValue: CLEARED_DATE,
		});
	};

	private onStartDateChange = (value: TDateInputValue) => {
		this.setState({
			startDateValue: value,
		});
	};

	private onEndDateChange = (value: TDateInputValue) => {
		this.setState({
			endDateValue: value,
		});
	};
}
