import React from 'react';
import { storiesOf } from '@storybook/react';
import { Autocomplete } from './Autocomplete';
import { PURE } from '../../utils/pure';
import Demo from '../demo/Demo';
import css from './Autocomplete.page.styl';
const data: string[] = Array.from(new Array(20).keys()).map(v => `${v}`);
const filter = (value: string) => (item: string, index: number) => item.indexOf(value) !== -1;

const theme = {
	Input: {
		container: css.autocomplete__input,
	},
	Popover: {
		container: css.autocomplete__popover,
	},
	MenuItem: {
		Highlight: {
			mark: css.highlight__mark,
		},
	},
};

@PURE
class AutocompletePage extends React.Component {
	state = {
		value: '',
	};

	render() {
		return (
			<Demo>
				<Autocomplete
					data={data}
					filter={filter}
					theme={theme}
					value={this.state.value}
					onValueChange={this.onValueChange}
				/>
			</Demo>
		);
	}

	onValueChange = (value: string | undefined) => {
		this.setState({
			value,
		});
	};
}

storiesOf('Autocomplete', module).add('Default', () => {
	return (
		<Demo>
			<AutocompletePage />
		</Demo>
	);
});
