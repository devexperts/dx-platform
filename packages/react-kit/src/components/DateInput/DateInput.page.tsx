import * as React from 'react';
import { action, storiesOf } from '@devexperts/tools/dist/utils/storybook';
import { AddIcon } from '../../icons/add-icon';
import { CalendarIcon } from '../../icons/calendar-icon';
import { DecreaseIcon } from '../../icons/decrease-icon';
import { SmallCrossIcon as ClearIcon } from '../../icons/small-cross-icon';

import { DateFormatType, DateInput, TCalendarProps, TDate } from './DateInput';
import { stateful } from '../Control/Control';
import { Demo } from '../demo/Demo';
import { Button } from '../Button/Button';
import { ToggleButtons } from '../ToggleButtons/ToggleButtons';
import { some, none } from 'fp-ts/lib/Option';

const Stateful = stateful()(DateInput);
const onChange = (value: { date: Date | null | undefined }) => action('change')(value);
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

type TState = Readonly<{
	value: TDate;
	dateFormatType: DateFormatType;
}>;

class DateInputPage extends React.Component<any, TState> {
	private target: any;
	readonly state: TState = {
		value: { day: some(1), month: some(1), year: some(2018) },
		dateFormatType: DateFormatType.DMY,
	};

	render() {
		const { isDisabled, error } = this.props;

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
						value={this.state.value}
					/>
					<Button onClick={this.onControlledManualClear}>Clear</Button>
				</section>
				{/* <section>
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
						defaultValue={{ date: new Date() }}
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
						defaultValue={{ date: new Date() }}
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
						defaultValue={{ date: new Date() }}
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
						defaultValue={{ date: new Date() }}
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
						defaultValue={{ date: new Date() }}
					/>
				</section> */}
				<section>
					<h1>calendar output target</h1>
					<div ref={el => (this.target = el)} />
				</section>
			</Demo>
		);
	}

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

	private onControlledChange = (value: TDate) => {
		console.log(value);
		this.setState({
			value
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
