import { INPUT } from '../input/Input';
import * as inputTheme from '../input/Input.demo.styl';

import { BUTTON } from '../Button/Button';
import * as buttonTheme from '../Button/Button.styl';

import { LOADING_INDICATOR } from '../LoadingIndicator/LoadingIndicator';
import * as loadingIndicatorTheme from '../LoadingIndicator/LoadingIndicator.demo.styl';

import { CHECKBOX } from '../Checkbox/Checkbox';
import * as checkboxTheme from '../Checkbox/Checkbox.demo.styl';

import { POPOVER } from '../Popover/Popover';
import * as popoverTheme from '../Popover/Popover.demo.styl';
import * as popoverTransitionsTheme from '../Popover/Popover.transitions.styl';

import { LIST } from '../List/List';
import * as listTheme from '../List/List.demo.styl';

import { MENU } from '../Menu/Menu';
import * as menuTheme from '../Menu/Menu.demo.styl';

import { SELECTBOX } from '../Selectbox/Selectbox';
import * as selectBoxTheme from '../Selectbox/Selectbox.demo.styl';

import { TABLE } from '../Table/Table';
import * as tableTheme from '../Table/Table.demo.styl';

import { HORIZONTAL_SCROLLBAR } from '../Scrollbar/HorizontalScrollbar';
import * as horScrollbar from '../Scrollbar/HorizontalScrollbar.demo.styl';

import { VERTICAL_SCROLLBAR } from '../Scrollbar/VerticalScrollbar';
import * as vertScrollbar from '../Scrollbar/VerricalScrollbar.demo.styl';

import { SCROLLABLE } from '../Scrollable/Scrollable';
import * as scrollableTheme from '../Scrollable/Scrollable.styl';

import { GRID } from '../Grid/Grid';
import * as gridTheme from '../Grid/Grid.styl';

import { BUTTON_ICON } from '../ButtonIcon/ButtonIcon';
import * as buttonIconTheme from '../ButtonIcon/ButtonIcon.styl';

import { PASSWORD_INPUT } from '../PasswordInput/PasswordInput';
import * as passwordInputTheme from '../PasswordInput/PasswordInput.demo.styl';

import { LINK } from '../Link/Link';
import * as linkTheme from '../Link/Link.styl';

import { TOGGLE_BUTTONS } from '../ToggleButtons/ToggleButtons';
import * as toggleButtonsTheme from '../ToggleButtons/ToggleButtons.demo.styl';

import { LOADING_INDICATION } from '../LoadingIndication/LoadingIndication';
import * as loadingIndicationTheme from '../LoadingIndication/LoadingIndication.demo.styl';

import { POPUP } from '../Popup/Popup';
import * as popupTheme from '../Popup/Popup.demo.styl';

import { STEPPABLE_INPUT } from '../SteppableInput/SteppableInput';
import * as steppableInput from '../SteppableInput/theme/SteppableInput.styl';
import * as steppableInputInput from '../SteppableInput/theme/Input.styl';
import * as steppableInputButtonIcon from '../SteppableInput/theme/ButtonIcon.styl';

import { TIME_INPUT } from '../TimeInput/TimeInput';
import * as timeInput from '../TimeInput/theme/TimeInput.styl';

import { DATE_INPUT } from '../DateInput/DateInput';
import * as dateInputTheme from '../DateInput/theme/DateInput.demo.styl';
import * as dateInputButtonIconTheme from '../DateInput/theme/ButtonIcon.demo.styl';

import { AUTOCOMPLETE } from '../Autocomplete/Autocomplete';
import * as autocompleteTheme from '../Autocomplete/Autocomplete.styl';

import { EXPANDABLE } from '../Expandable/Expandable';
import * as expandableTheme from '../Expandable/Expandable.demo.styl';

export default {
	[INPUT]: inputTheme,
	[BUTTON]: buttonTheme,
	[LOADING_INDICATOR]: loadingIndicatorTheme,
	[CHECKBOX]: checkboxTheme,
	[POPOVER]: {
		...popoverTheme,
		transitions: popoverTransitionsTheme,
	},
	[LIST]: listTheme,
	[MENU]: menuTheme,
	[SELECTBOX]: selectBoxTheme,
	[EXPANDABLE]: expandableTheme,
	[TABLE]: tableTheme,
	[HORIZONTAL_SCROLLBAR]: horScrollbar,
	[VERTICAL_SCROLLBAR]: vertScrollbar,
	[SCROLLABLE]: scrollableTheme,
	[AUTOCOMPLETE]: autocompleteTheme,
	[GRID]: gridTheme,
	[BUTTON_ICON]: buttonIconTheme,
	[DATE_INPUT]: {
		...dateInputTheme,
		ButtonIcon: dateInputButtonIconTheme,
		CalendarButtonIcon: dateInputButtonIconTheme,
	},
	[STEPPABLE_INPUT]: {
		...steppableInput,
		Input: steppableInputInput,
		ButtonIcon: steppableInputButtonIcon,
		ClearButtonIcon: steppableInputButtonIcon,
	},
	[TIME_INPUT]: timeInput,
	[PASSWORD_INPUT]: {
		container: passwordInputTheme.container,
		Input: {
			container: passwordInputTheme.input,
		},
		RevealButton: {
			container: passwordInputTheme.button,
			icon: passwordInputTheme.icon,
		},
	},
	[LINK]: linkTheme,
	[TOGGLE_BUTTONS]: toggleButtonsTheme,
	[LOADING_INDICATION]: loadingIndicationTheme,
	[POPUP]: popupTheme,
};
