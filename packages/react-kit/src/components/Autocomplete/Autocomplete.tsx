import React from 'react';
import { withTheme } from '../../utils/withTheme';
import { ComponentClass, SFC } from 'react';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { Menu, TMenuProps } from '../Menu/Menu';
import { Input, TInputProps } from '../input/Input';
import { Popover, TPopoverProps } from '../Popover/Popover';
import { Pure } from '../Pure/Pure';
import { KeyCode } from '../Control/Control';
import { AutocompleteMenuItem, TAutocompleteMenuItemProps } from './AutocompleteMenuItem';
import { withDefaults } from '../../utils/with-defaults';

export const AUTOCOMPLETE = Symbol('Autocomplete') as symbol;

export type TFullAutocompleteProps = TInputProps & {
	Input: ComponentClass<TInputProps>;
	Popover: ComponentClass<TPopoverProps> | SFC<TPopoverProps>;
	Menu: ComponentClass<TMenuProps> | SFC<TMenuProps>;
	MenuItem: ComponentClass<TAutocompleteMenuItemProps>;
	value: string;
	data: any[];
	filter: (value: string) => (item: any, index: number) => boolean;
	theme: {
		container?: string;
		Input?: TInputProps['theme'];
		Popover?: TPopoverProps['theme'];
		Menu?: TMenuProps['theme'];
		MenuItem?: TAutocompleteMenuItemProps['theme'];
	};
};

class RawAutocomplete extends React.Component<TFullAutocompleteProps> {
	readonly state = {
		isOpened: false,
	};

	private input: any;
	isFocused = false;

	render() {
		const { theme, Input, MenuItem, Menu, Popover, data, value, filter, ...inputProps } = this.props;

		return (
			<div className={theme.container}>
				<Input
					{...inputProps}
					theme={theme.Input}
					value={value}
					ref={(el: any) => (this.input = el)}
					onKeyDown={this.onInputKeyDown}
					onValueChange={this.onInputChange}
					onKeyPress={this.onInputKeyPress}
				/>

				<Popover
					isOpened={this.state.isOpened}
					theme={theme.Popover}
					anchor={this.input}
					onRequestClose={this.onPopoverRequestClose}
					closeOnClickAway={true}>
					<Pure data={data} value={value} Menu={Menu} filter={filter}>
						{() => {
							const filtered = data.filter(filter(value));
							return (
								filtered.length > 0 && (
									<Menu onItemSelect={this.onMenuItemSelect} theme={theme.Menu}>
										{filtered.map((item: any, i: number) => (
											<MenuItem key={i} theme={theme.MenuItem} search={value} value={item}>
												{item}
											</MenuItem>
										))}
									</Menu>
								)
							);
						}}
					</Pure>
				</Popover>
			</div>
		);
	}

	onInputKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		//keyDown may be fired from menu, don't call props handler
		if ((e.keyCode || e.which) === KeyCode.Tab) {
			//loose focus on tab press
			this.isFocused = false;
			this.setState({
				isOpened: false,
			});
		}
	};

	onInputKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
		if ((e.keyCode || e.which) === KeyCode.Enter) {
			this.isFocused = false;
			this.setState({
				isOpened: false,
			});
		}
	};

	onInputChange = (value?: string) => {
		const { onValueChange } = this.props;
		this.setState({
			isOpened: value && value.length !== 0,
		});

		onValueChange && onValueChange(value);
	};

	onPopoverRequestClose = () => {
		this.setState({
			isOpened: false,
		});
	};

	onMenuItemSelect = (value: any) => {
		const { onValueChange } = this.props;
		this.setState({
			isOpened: false,
		});
		onValueChange && onValueChange(value);
	};
}

export type TAutocompleteProps = PartialKeys<
	TFullAutocompleteProps,
	'theme' | 'Input' | 'Popover' | 'MenuItem' | 'Menu'
>;
export const Autocomplete: ComponentClass<TAutocompleteProps> = withTheme(AUTOCOMPLETE)(
	withDefaults<TFullAutocompleteProps, 'Input' | 'Popover' | 'MenuItem' | 'Menu'>({
		Input,
		Menu,
		Popover,
		MenuItem: AutocompleteMenuItem,
	})(RawAutocomplete),
);
