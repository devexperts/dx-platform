import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { PURE } from '@devexperts/utils/lib/react/pure';
import classnames from 'classnames';
import Demo from '../demo/Demo';
import {CheckboxTickIcon} from '@devexperts/icons/lib/checkbox-tick-icon';

import { Checkbox } from './Checkbox';
import { storiesOf, action } from '@devexperts/tools/utils/storybook';

import checkboxIcon from './img/icon-checkbox-tick.svg';
import css from './Checkbox.page.styl';

const darkDemoTheme = {
	container: css.container,
	view: css.view,
	icon: css.icon,
	icon_isDisabled: css.icon_isDisabled
};

export const CHECKBOX = 'Checkbox';

@PURE
class CheckboxPage extends React.Component<{isDisabled?: boolean}, {isChecked: boolean}> {
	state = {
		isChecked: true
	};

	render() {
		const labelClassName = classnames(css.label, {
			[css.label_isDisabled]: this.props.isDisabled
		});
		return (
			<Demo>
				<div className={css.container}>
					<label htmlFor="check1" className={labelClassName}>
						<Checkbox theme={darkDemoTheme}
								  checkMark={<CheckboxTickIcon/>}
						          checkboxIconName={checkboxIcon}
						          value={this.state.isChecked}
						          onValueChange={this.onChangeHandler}
						          isDisabled={this.props.isDisabled}
						          id="check1"/>
						I'am controlled checkbox
					</label>
				</div>
			</Demo>
		);
	}

	onChangeHandler = (value: boolean) => {
		this.setState({
			isChecked: value
		});
	}
}

storiesOf('Checkbox', module).add('default', () => <CheckboxPage/>)
	.add('disabled', () => <CheckboxPage isDisabled={true}/>);

