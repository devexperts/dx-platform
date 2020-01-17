import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AddIcon } from '../../icons/add-icon';
import { CalendarIcon } from '../../icons/calendar-icon';
import { DecreaseIcon } from '../../icons/decrease-icon';
import { SmallCrossIcon as ClearIcon } from '../../icons/small-cross-icon';

import { DateInput, TCalendarProps } from './DateInput';
import { stateful } from '../Control/Control';
import { Demo } from '../demo/Demo';
import { Button } from '../Button/Button';
import { ToggleButtons } from '../ToggleButtons/ToggleButtons';
import { some, none } from 'fp-ts/lib/Option';
import { TDateInputValue, DateFormatType } from './DateInput.model';
import { ReactRef } from '../../utils/typings';
import { findDOMNode } from 'react-dom';

const Stateful = stateful()(DateInput);
const onChange = (value: TDateInputValue) => action('change')(value);
const onClear = () => action('clear')();

const Calendar: React.SFC<TCalendarProps> = props => {
	const onChange = () => props.onValueChange && props.onValueChange(new Date());
	return (
		<div onMouseDown={props.onMouseDown}>
			calendar
			<Button onClick={onChange}>click me</Button>
		</div>
	);
};

type TDateInputPageState = Readonly<{
	value: TDateInputValue;
	dateFormatType: DateFormatType;
	isStartDateFocused: boolean;
	isEndDateFocused: boolean;
}>;

class DateInputPage extends React.Component<any, TDateInputPageState> {
	private endDateInput: ReactRef<HTMLElement> | null = null;
	private target: any;
	readonly state: TDateInputPageState = {
		value: { day: some(1), month: some(1), year: some(2018) },
		dateFormatType: DateFormatType.DMY,
		isStartDateFocused: false,
		isEndDateFocused: false,
	};

	render() {
		const { isDisabled, error } = this.props;
		const { value } = this.state;

		return (
			<Demo>
				<div>
					DateFormatType
					<ToggleButtons toggleIndex={this.getToggleIndex()} isVertical={true} onChange={this.onToggleChange}>
						<Button>DD/MM/YYYY</Button>
						<Button>MM/DD/YYYY</Button>
					</ToggleButtons>
				</div>
				<input type="date" id="date" disabled={isDisabled} />
				<section>
					<h1>Controlled</h1>
					<DateInput
						dateFormatType={this.state.dateFormatType}
						onValueChange={this.onControlledChange}
						clearIcon={<ClearIcon />}
						incrementIcon={<AddIcon />}
						decrementIcon={<DecreaseIcon />}
						onClear={this.onControlledClear}
						error={error}
						value={value}
					/>
					<Button onClick={this.onControlledManualClear}>Clear</Button>
				</section>
				<section>
					<h1>without Calendar</h1>
					<Stateful
						dateFormatType={this.state.dateFormatType}
						decrementIcon={<DecreaseIcon />}
						isDisabled={isDisabled}
						incrementIcon={<AddIcon />}
						clearIcon={<ClearIcon />}
						error={error}
						onValueChange={onChange}
						onClear={onClear}
						defaultValue={{ day: none, month: none, year: none }}
					/>
					<Stateful
						dateFormatType={this.state.dateFormatType}
						decrementIcon={<DecreaseIcon />}
						isDisabled={isDisabled}
						incrementIcon={<AddIcon />}
						clearIcon={<ClearIcon />}
						onValueChange={onChange}
						error={error}
						onClear={onClear}
						defaultValue={{ day: none, month: none, year: none }}
					/>
					<Stateful
						dateFormatType={this.state.dateFormatType}
						decrementIcon={<DecreaseIcon />}
						isDisabled={isDisabled}
						incrementIcon={<AddIcon />}
						clearIcon={<ClearIcon />}
						onValueChange={onChange}
						error={error}
						onClear={onClear}
						defaultValue={{ day: none, month: none, year: none }}
					/>
				</section>
				<section>
					<h1>with calendar</h1>
					<Stateful
						dateFormatType={this.state.dateFormatType}
						decrementIcon={<DecreaseIcon />}
						incrementIcon={<AddIcon />}
						isDisabled={isDisabled}
						error={error}
						clearIcon={<ClearIcon />}
						calendarIcon={<CalendarIcon />}
						onValueChange={onChange}
						onClear={onClear}
						Calendar={Calendar}
						defaultValue={{ day: none, month: none, year: none }}
					/>
					<Stateful
						dateFormatType={this.state.dateFormatType}
						decrementIcon={<DecreaseIcon />}
						incrementIcon={<AddIcon />}
						isDisabled={isDisabled}
						clearIcon={<ClearIcon />}
						error={error}
						calendarIcon={<CalendarIcon />}
						onValueChange={onChange}
						onClear={onClear}
						Calendar={Calendar}
						target={this.target}
						defaultValue={{ day: none, month: none, year: none }}
					/>
				</section>
				<section>
					<h1>calendar output target</h1>
					<div ref={el => (this.target = el)} />
				</section>
				<section>
					<h1>Date range</h1>
					<p>Example how to combine two DateInputs and test case with focus/blur inputs by press enter</p>
					<div onKeyPress={this.onKeyPress}>
						<Stateful
							dateFormatType={this.state.dateFormatType}
							onValueChange={onChange}
							clearIcon={<ClearIcon />}
							incrementIcon={<AddIcon />}
							decrementIcon={<DecreaseIcon />}
							onClear={onClear}
							error={error}
							defaultValue={{ day: none, month: none, year: none }}
							onFocus={this.onStartDateFocus}
							onBlur={this.onStartDateBlur}
							isDisabled={isDisabled}
						/>
						<Stateful
							dateFormatType={this.state.dateFormatType}
							onValueChange={onChange}
							clearIcon={<ClearIcon />}
							incrementIcon={<AddIcon />}
							decrementIcon={<DecreaseIcon />}
							onClear={onClear}
							error={error}
							defaultValue={{ day: none, month: none, year: none }}
							innerRef={this.getEndDateRef}
							onFocus={this.onEndDateFocus}
							onBlur={this.onEndDateBlur}
							isDisabled={isDisabled}
						/>
					</div>
				</section>
			</Demo>
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

	private onFocus = (reference: React.ReactInstance) => {
		const element = findDOMNode(reference);

		if (element instanceof HTMLElement) {
			element.focus();
		}
	};

	private onBlur = (reference: React.ReactInstance) => {
		const element = findDOMNode(reference);

		if (element instanceof HTMLElement) {
			element.blur();
		}
	};

	private getEndDateRef = (input: ReactRef<HTMLElement>): void => {
		this.endDateInput = input;
	};

	private getToggleIndex() {
		switch (this.state.dateFormatType) {
			case DateFormatType.DMY: {
				return 0;
			}
			case DateFormatType.MDY: {
				return 1;
			}
		}
	}

	private onControlledManualClear = () => {
		this.setState({
			value: { day: none, month: none, year: none },
		});
	};

	private onControlledClear = () => {
		this.setState({
			value: { day: none, month: none, year: none },
		});
	};

	private onControlledChange = (value: TDateInputValue) => {
		this.setState({
			value,
		});
	};

	private onToggleChange = (index: number) => {
		switch (index) {
			case 0: {
				this.setState({
					dateFormatType: DateFormatType.DMY,
				});
				break;
			}
			case 1: {
				this.setState({
					dateFormatType: DateFormatType.MDY,
				});
				break;
			}
		}
	};
}

storiesOf('DateInput', module)
	.add('default', () => <DateInputPage />)
	.add('disabled', () => <DateInputPage isDisabled={true} />)
	.add('invalid', () => <DateInputPage error={true} />);
