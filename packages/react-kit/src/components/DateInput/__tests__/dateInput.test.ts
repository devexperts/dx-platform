import { decrementMonth, decrementMonthOption, incrementMonth, incrementMonthOption } from '../DateInput.model';
import { some, none, option, map, chain } from 'fp-ts/lib/Option';
import { array } from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/pipeable';

describe('date input', () => {
	describe('decrement month', () => {
		const months = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		const expextedMonths = [11, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

		it('should decrement month or return default value', () => {
			const newMonths = months.map(month => decrementMonth(month));
			expect(newMonths).toEqual(expextedMonths);
		});
		it('should decrement month or return default value (works with option)', () => {
			const newMonths = array.sequence(option)(months.map(month => decrementMonthOption(some(month))));
			pipe(
				newMonths,
				map(value => expect(value).toEqual(expextedMonths)),
			);

			const defaultOptionMonth = some(11);
			const noneMonth = decrementMonthOption(none);
			pipe(
				noneMonth,
				chain(noneMonth =>
					pipe(
						defaultOptionMonth,
						map(month => expect(noneMonth).toBe(month)),
					),
				),
			);
		});
	});
	describe('increment month', () => {
		const months = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
		const expextedMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 0];

		it('should increment month or return default value', () => {
			const newMonths = months.map(month => incrementMonth(month));
			expect(newMonths).toEqual(expextedMonths);
		});
		it('should increment month or return default value (works with option)', () => {
			const newMonths = array.sequence(option)(months.map(month => incrementMonthOption(some(month))));
			pipe(
				newMonths,
				map(value => expect(value).toEqual(expextedMonths)),
			);

			const defaultOptionMonth = some(0);
			const noneMonth = incrementMonthOption(none);
			pipe(
				noneMonth,
				chain(noneMonth =>
					pipe(
						defaultOptionMonth,
						map(month => expect(noneMonth).toBe(month)),
					),
				),
			);
		});
	});
});
