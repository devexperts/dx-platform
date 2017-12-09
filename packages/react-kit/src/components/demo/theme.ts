// //this is a demo theme config - includes some additional presentational styles that are not included in the lib
// import config from '../config/theme';
//
// import { LIST } from '../components/List/List.tsx';
// import list from '../components/List/List.demo.styl';
//
// import { MENU } from '../components/Menu/Menu.tsx';
// import menu from '../components/Menu/Menu.demo.styl';
//
// import { POPOVER } from '../components/Popover/Popover.tsx';
// import popover from '../components/Popover/Popover.demo.styl';
//
// import { SELECTBOX } from '../components/Selectbox/Selectbox.tsx';
// import selectbox from '../components/Selectbox/Selectbox.demo.styl';
//
// import { TOGGLE_BUTTONS } from '../components/ToggleButtons/ToggleButtons.tsx';
// import toggleButtons from '../components/ToggleButtons/ToggleButtons.demo.styl';
//
// import { COMBOBOX } from '../components/Combobox/Combobox';
// import combobox from '../components/Combobox/Combobox.demo.styl';
//
// import { INPUT } from '../components/Input/Input';
// import input from '../components/Input/Input.demo.styl';
//
// import { PASSWORD_INPUT } from '../components/PasswordInput/PasswordInput';
// import passwordInput from '../components/PasswordInput/PasswordInput.demo.styl';
//
// import { NUMERIC_STEPPER } from '../components/NumericStepper/NumericStepper.jsx';
// import numericStepper from '../components/NumericStepper/NumericStepper.demo.styl';
//
// import { TABLE } from '../components/Table/Table';
// import table from '../components/Table/Table.demo.styl';
//
// import { HORIZONTAL_SCROLLBAR } from '../components/Scrollbar/HorizontalScrollbar.jsx';
// import horizontalScrollbar from '../components/Scrollbar/HorizontalScrollbar.demo.styl';
//
// import { VERTICAL_SCROLLBAR } from '../components/Scrollbar/VerticalScrollbar.jsx';
// import verticalScrollbar from '../components/Scrollbar/VerricalScrollbar.demo.styl';
//
// import { CHECKBOX } from '../components/Checkbox/Checkbox.tsx';
// import checkbox from '../components/Checkbox/Checkbox.demo.styl';
//
// import { POPUP } from '../components/Popup/Popup.tsx';
// import popup from '../components/Popup/Popup.demo.styl';
//
// import { HIGHLIGHT } from '../components/Highlight/Highlight.tsx';
// import highlight from '../components/Highlight/Highlight.demo.styl';
//
// import { DATE_PICKER } from '../components/DatePicker/DatePicker';
// import datePicker from '../components/DatePicker/DatePicker.demo.styl';
//
// import { CALENDAR } from '../components/Calendar/Calendar';
// import calendarTheme from '../components/Calendar/Calendar.demo.styl';
//
// import { EXPANDABLE } from '../components/Expandable/Expandable.tsx';
// import expandable from '../components/Expandable/Expandable.demo.styl';
//
// import { LOADING_INDICATOR } from '../components/LoadingIndicator/LoadingIndicator';
// import loadingIndicator from '../components/LoadingIndicator/LoadingIndicator.demo.styl';
//
// import { LOADING_INDICATION } from '../components/LoadingIndication/LoadingIndication.tsx';
// import loadingIndication from '../components/LoadingIndication/LoadingIndication.demo.styl';
//
// import { STEPPABLE_INPUT } from '../components/SteppableInput/SteppableInput';
// import steppableInput from '../components/SteppableInput/theme/SteppableInput.demo.styl';
// import steppableInputInput from '../components/SteppableInput/theme/Input.demo.styl';
// import steppableInputButtonIcon from '../components/SteppableInput/theme/ButtonIcon.demo.styl';
//
// import { TIME_INPUT } from '../components/TimeInput/TimeInput';
// import timeInput from '../components/TimeInput/theme/TimeInput.demo.styl';
// import timeInputSteppableInput from '../components/TimeInput/theme/SteppableInput.demo.styl';
//
// import { DATE_INPUT } from '../components/DateInput/DateInput';
// import dateInput from '../components/DateInput/theme/DateInput.demo.styl';
// import dateInputSteppableInput from '../components/DateInput/theme/SteppableInput.demo.styl';
// import dateInputButtonIcon from '../components/DateInput/theme/ButtonIcon.demo.styl';
//
// export default {
// 	...config,
// 	//additional demo styles
// 	[LIST]: list,
// 	[MENU]: menu,
// 	[POPOVER]: popover,
// 	[TOGGLE_BUTTONS]: toggleButtons,
// 	[INPUT]: input,
// 	[NUMERIC_STEPPER]: numericStepper,
// 	[COMBOBOX]: combobox,
// 	[SELECTBOX]: selectbox,
// 	[TABLE]: table,
// 	[HORIZONTAL_SCROLLBAR]: horizontalScrollbar,
// 	[VERTICAL_SCROLLBAR]: verticalScrollbar,
// 	[CHECKBOX]: checkbox,
// 	[POPUP]: popup,
// 	[HIGHLIGHT]: highlight,
// 	[DATE_PICKER]: datePicker,
// 	[CALENDAR]: calendarTheme,
// 	[EXPANDABLE]: {
// 		...expandable,
// 		Handler: {
// 			container: expandable.handler
// 		}
// 	},
// 	[CALENDAR]: calendarTheme,
// 	[PASSWORD_INPUT]: {
// 		container: passwordInput.container,
// 		RevealButton: {
// 			container: passwordInput.button,
// 			icon: passwordInput.icon
// 		},
// 		Input: {
// 			container: passwordInput.input
// 		}
// 	},
// 	[LOADING_INDICATOR]: loadingIndicator,
// 	[LOADING_INDICATION]: loadingIndication,
// 	[STEPPABLE_INPUT]: {
// 		...steppableInput,
// 		Input: steppableInputInput,
// 		ButtonIcon: steppableInputButtonIcon,
// 		ClearButtonIcon: steppableInputButtonIcon
// 	},
// 	[TIME_INPUT]: {
// 		...timeInput,
// 		SteppableInput: {
// 			Input: timeInputSteppableInput
// 		}
// 	},
// 	[DATE_INPUT]: {
// 		...dateInput,
// 		SteppableInput: {
// 			Input: dateInputSteppableInput
// 		},
// 		ButtonIcon: dateInputButtonIcon,
// 		CalendarButtonIcon: dateInputButtonIcon
// 	}
// };

import {INPUT} from '../input/Input';
import inputTheme from '../input/Input.demo.styl';

import {BUTTON} from '../Button/Button';
import buttonTheme from '../Button/Button.styl';

import {LOADING_INDICATOR} from '../LoadingIndicator/LoadingIndicator';
import loadingIndicatorTheme from '../LoadingIndicator/LoadingIndicator.demo.styl'

export default {
	[INPUT]: inputTheme,
	[BUTTON]: buttonTheme,
	[LOADING_INDICATOR]: loadingIndicatorTheme
}