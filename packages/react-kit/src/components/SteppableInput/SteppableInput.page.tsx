import React, { createRef } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import pageTheme from './theme/SteppableInput.page.styl';
import { AddIcon } from '../../icons/add-icon';
import { DecreaseIcon } from '../../icons/decrease-icon';
import { SmallCrossIcon as ClearIcon } from '../../icons/small-cross-icon';
import { SteppableInput } from './SteppableInput';
import { Demo } from '../demo/Demo';

class DemoInput extends React.Component<any, any> {
	private input = createRef<HTMLInputElement>();

	render() {
		const { onIncrement, onDecrement, error, onClear, isDisabled } = this.props;

		return (
			<div>
				<SteppableInput
					onIncrement={onIncrement}
					onDecrement={onDecrement}
					onClear={onClear}
					error={error}
					onFocus={this.onFocus}
					clearIcon={<ClearIcon />}
					decrementIcon={<DecreaseIcon />}
					incrementIcon={<AddIcon />}
					isDisabled={isDisabled}>
					<input className={pageTheme.customInput} tabIndex={-1} disabled={isDisabled} ref={this.input} />
				</SteppableInput>
			</div>
		);
	}

	private onFocus = () => {
		const input = this.input.current;
		input?.focus();
	};
}

storiesOf('SteppableInput', module).add('default', () => {
	return (
		<Demo>
			<DemoInput onIncrement={action('increment')} onDecrement={action('decremnt')} />
			<DemoInput onClear={action('clear')} />
			<DemoInput
				onIncrement={action('increment')}
				isDisabled={true}
				onDecrement={action('decremnt')}
				onClear={action('clear')}
			/>
			<DemoInput onIncrement={action('increment')} onDecrement={action('decremnt')} onClear={action('clear')} />
			<DemoInput
				onIncrement={action('increment')}
				onDecrement={action('decremnt')}
				error={'Error'}
				onClear={action('clear')}
			/>
		</Demo>
	);
});
