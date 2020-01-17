import React from 'react';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { ComponentClass } from 'react';
import { withTheme } from '../../utils/withTheme';
import { MenuItem, TMenuItemProps } from '../Menu/Menu';
import { Highlight, THighlightProps } from '../Highlight/Highlight';
import { withDefaults } from '../../utils/with-defaults';
const AUTOCOMPLETE_MENU_ITEM = Symbol('AutocompleteMenuItem') as symbol;

export type TFullAutocompleteMenuItemProps = TMenuItemProps & {
	search: string;
	value: string;
	theme: TMenuItemProps['theme'] & {
		Highlight?: THighlightProps['theme'];
	};
};

class RawAutocompleteMenuItem extends React.Component<TFullAutocompleteMenuItemProps> {
	render() {
		const { search, theme, ...menuItemProps } = this.props;

		return (
			<MenuItem {...menuItemProps}>
				<Highlight search={search} theme={theme.Highlight}>
					{this.props.value}
				</Highlight>
			</MenuItem>
		);
	}
}

export type TAutocompleteMenuItemProps = PartialKeys<TFullAutocompleteMenuItemProps, 'theme' | 'search'>;
export const AutocompleteMenuItem: ComponentClass<TAutocompleteMenuItemProps> = withTheme(AUTOCOMPLETE_MENU_ITEM)(
	withDefaults<TFullAutocompleteMenuItemProps, 'search'>({
		search: '',
	})(RawAutocompleteMenuItem),
);
