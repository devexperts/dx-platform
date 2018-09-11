import * as React from 'react';
import { Component } from 'react';
import Demo from '../demo/Demo';
import { PURE } from '../../utils/pure';
import { Slider } from './slider.component';
import { storiesOf, action } from '@devexperts/tools/dist/utils/storybook';
import * as theme from './slider.demo.styl';
import { scaleLinear } from 'd3-scale';
import { Button } from '../Button/Button';
import { MouseEvent } from 'react';

const log = action('change');

type TSliderPageProps = {
	value: number;
	isDisabled?: boolean;
};

@PURE
class SliderPage extends Component<TSliderPageProps> {
	state = {
		value: this.props.value,
	};

	render() {
		const { value } = this.state;
		const { isDisabled } = this.props;
		const min = 0;
		const max = 100;
		const width = 200;
		return (
			<Demo>
				<div className={theme.simple}>
					<Button isFlat={true} onClick={this.handleClick(min)}>
						{min}
					</Button>
					<Slider theme={theme} isDisabled={isDisabled} width={width} step={20} min={min} max={max} inlineTrackStyle={{ backgroundColor: this.getBackground(value) }} value={value} onValueChange={this.onValueChange} />
					<Button isFlat={true} onClick={this.handleClick(max)}>
						{max}
					</Button>
				</div>
			</Demo>
		);
	}

	private getBackground = (value: number) => {
		let red = 255;
		let green = 255;

		if (value < 50) {
			green = value * 2 * 255 / 100;
		} else {
			red = (100 - value) * 2 * 255 / 100;
		}
		return `rgb(${red}, ${green}, 0)`;
	};

	private handleClick = (value: number) => (event: MouseEvent<HTMLButtonElement>) => {
		this.setState({
			value,
		});
	};

	onValueChange = (value: number) => {
		log(value);
		this.setState({
			value,
		});
	};
}

class ExtraSlider extends Component {
	state = {
		value: 50,
	};

	render() {
		const { value } = this.state;
		const min = -50;
		const max = 50;
		const width = 200;
		const xScale = scaleLinear()
			.domain([min, max])
			.range([0, width]);

		const ticks = [-50, -25, 0, 25, 50];
		const xPosition = xScale(value);
		const zeroPosition = min < 0 ? xScale(0) : 0;
		const maxPosition = xScale(max);

		const zeroPositionFromRight = `${maxPosition - zeroPosition}px`;
		const zeroPositionFromLeft = `${zeroPosition}px`;

		const trackStyles = {
			left: `${value > 0 ? zeroPositionFromLeft : 'auto'}`,
			right: `${value < 0 ? zeroPositionFromRight : 'auto'}`,
			width: value > 0 ? xPosition - zeroPosition : zeroPosition - xPosition,
		};

		const newTheme = {
			...theme,
			track: value > 0 ? `${theme.track} ${theme.track_positive}` : theme.track,
		};

		return (
			<Demo>
				<Slider theme={newTheme} width={width} step={20} min={min} max={max} value={value} inlineTrackStyle={trackStyles} onValueChange={this.onValueChange} />
				<div className={theme.ticks}>
					{ticks.map(tick => (
						<div
							style={{ transform: `translate(${xScale(tick)}px, 0)` }}
							key={tick}
							className={theme.tick}>
							<span className={theme.tickValue}>{tick}</span>
						</div>
					))}
				</div>
			</Demo>
		);
	}

	onValueChange = (value: number) => {
		log(value);
		this.setState({
			value: Math.round(value),
		});
	};
}

storiesOf('Slider', module)
	.add('default', () => <SliderPage value={0} />)
	.add('disabled', () => <SliderPage value={40} isDisabled={true} />)
	.add('extra', () => <ExtraSlider />);
