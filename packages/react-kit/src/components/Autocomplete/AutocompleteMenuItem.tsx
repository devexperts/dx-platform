import * as React from 'react';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { ObjectClean } from 'typelevel-ts';
import { ComponentClass } from 'react';
import { withTheme } from '../../utils/withTheme';
import { MenuItem, TMenuItemProps } from '../Menu/Menu';
import { Highlight, THighlightProps } from '../Highlight/Highlight';
const AUTOCOMPLETE_MENU_ITEM= Symbol('AutocompleteMenuItem') as symbol;

export type TFullAutocompleteMenuItemProps = TMenuItemProps & {
	search: string;
	value: string;
	theme: TMenuItemProps['theme'] & {
		Highlight?: THighlightProps['theme'];
	};
};

class RawAutocompleteMenuItem extends React.Component<TFullAutocompleteMenuItemProps> {
	static defaultProps = {
		search: '',
	};

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

export type TAutocompleteMenuItemProps = ObjectClean<PartialKeys<TFullAutocompleteMenuItemProps, 'theme' | 'search'>>;
export const AutocompleteMenuItem: ComponentClass<TAutocompleteMenuItemProps> = withTheme(AUTOCOMPLETE_MENU_ITEM)(
	RawAutocompleteMenuItem,
);
