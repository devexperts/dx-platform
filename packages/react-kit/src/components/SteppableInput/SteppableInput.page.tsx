import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { storiesOf, action } from '@devexperts/tools/dist/utils/storybook';
import * as pageTheme from './theme/SteppableInput.page.styl';
import { AddIcon } from '../../icons/add-icon';
import { DecreaseIcon } from '../../icons/decrease-icon';
import { SmallCrossIcon as ClearIcon } from '../../icons/small-cross-icon';
import { SteppableInput, TSteppableInputProps } from './SteppableInput';
import { Demo } from '../demo/Demo';

class DemoInput extends React.Component<any, any> {
	private input: any;

	render() {
		const { onIncrement, onDecrement, error, onClear, isDisabled } = this.props;

		return (
			<div>
				<SteppableInput onIncrement={onIncrement}
								onDecrement={onDecrement}
								onClear={onClear}
								error={error}
								onFocus={this.onFocus}
								ClearIcon={ClearIcon}
								DecrementIcon={DecreaseIcon}
								IncrementIcon={AddIcon}
								isDisabled={isDisabled} >
					<input className={pageTheme.customInput}
						   tabIndex={-1}
						   disabled={isDisabled}
						   ref={(el: any) => this.input = el}/>
				</SteppableInput>
			</div>
		);
	}

	onFocus = (e: any) => {
		const input = ReactDOM.findDOMNode(this.input) as any;
		input.focus();
	}
}

storiesOf('SteppableInput', module)
	.add('default', () => {
		return (
			<Demo>
				<DemoInput onIncrement={action('increment')}
						   onDecrement={action('decremnt')}/>
				<DemoInput onClear={action('clear')}/>
				<DemoInput onIncrement={action('increment')}
						   isDisabled={true}
						   onDecrement={action('decremnt')}
						   onClear={action('clear')}/>
				<DemoInput onIncrement={action('increment')}
						   onDecrement={action('decremnt')}
						   onClear={action('clear')}/>
				<DemoInput onIncrement={action('increment')}
						   onDecrement={action('decremnt')}
						   error={'Error'}
						   onClear={action('clear')}/>
			</Demo>
		);
	})