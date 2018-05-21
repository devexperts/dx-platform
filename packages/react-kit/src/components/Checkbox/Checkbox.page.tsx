import * as React from 'react';
import { PURE } from '../../utils/pure';
import * as classnames from 'classnames';
import Demo from '../demo/Demo';
import { CheckboxTickIcon } from '../../icons/checkbox-tick-icon';

import { Checkbox } from './Checkbox';
import { storiesOf, knobs } from '@devexperts/tools/dist/utils/storybook';

import * as css from './Checkbox.page.styl';

const darkDemoTheme = {
	container: css.container,
	view: css.view,
	icon: css.icon,
	icon_isDisabled: css.icon_isDisabled,
};

export const CHECKBOX = 'Checkbox';

@PURE
class CheckboxPage extends React.Component<{ isDisabled?: boolean }, { isChecked: boolean }> {
	state = {
		isChecked: true,
	};

	render() {
		const labelClassName = classnames(css.label, {
			[css.label_isDisabled]: this.props.isDisabled,
		});
		return (
			<Demo>
				<div className={css.container}>
					<label htmlFor="check1" className={labelClassName}>
						<Checkbox
							theme={darkDemoTheme}
							checkMark={<CheckboxTickIcon />}
							value={this.state.isChecked}
							onValueChange={this.onChangeHandler}
							isDisabled={this.props.isDisabled}
							id="check1"
						/>
						I'am controlled checkbox
					</label>
				</div>
			</Demo>
		);
	}

	onChangeHandler = (value: boolean) => {
		this.setState({
			isChecked: value,
		});
	};
}

storiesOf('Checkbox', module)
	.add('default', () => {
		return <CheckboxPage isDisabled={knobs.boolean('isDisabled', false)} />;
	})
	.add('disabled', () => <CheckboxPage isDisabled={true} />);
