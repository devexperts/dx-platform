import * as React from 'react';
import * as classnames from 'classnames';
import { DraggableData, Rnd } from 'react-rnd';
import { Component, CSSProperties, ComponentClass } from 'react';
import { scaleLinear, ScaleLinear } from 'd3-scale';
import { withTheme } from '../../utils/withTheme';
import { PartialKeys } from '@devexperts/utils/dist/object/object';
import { MakeTheme } from '../../utils/theme.utils';
import * as css from './theme/slider.component.styl';
import { MouseEventHandler } from 'react';
import { withDefaults } from '../../utils/with-defaults';
import { ComponentType } from 'react';

export const SLIDER = Symbol('Slider') as symbol;

export type TFullSliderHandlerProps = {
	theme: MakeTheme<'handler'>;
};

class SliderHandler extends React.Component<TFullSliderHandlerProps> {
	render() {
		const { theme } = this.props;
		return <div className={theme.handler} draggable={false} />;
	}
}

export type TFullSliderProps = {
	value: number;
	onValueChange: (value: number) => void;
	SliderHandler: ComponentType<TFullSliderHandlerProps>;
	theme: TFullSliderHandlerProps['theme'] &
		MakeTheme<'handleContainer' | 'container' | 'container_isDisabled' | 'track' | 'rail'>;
	inlineTrackStyle: CSSProperties;
	isDisabled: boolean;
	width: number;
	min: number;
	step: number;
	max: number;
};

type TRawSliderState = Readonly<{
	xScale: ScaleLinear<number, number>;
}>;

class RawSlider extends Component<TFullSliderProps, TRawSliderState> {
	private rail = React.createRef<HTMLDivElement>();

	readonly state: TRawSliderState = {
		xScale: this.buildScale(this.props.width, this.props.min, this.props.max),
	};

	componentWillReceiveProps(nextProps: TSliderProps) {
		if (nextProps.width !== this.props.width) {
			const { width, min, max } = nextProps;
			this.setState({
				xScale: this.buildScale(width, min, max),
			});
		}
	}

	render() {
		const { theme, SliderHandler, value, width, inlineTrackStyle, isDisabled } = this.props;
		const { xScale } = this.state;

		const xPosition = xScale(value);
		const position = { x: xPosition, y: 0 };

		const trackStyles = {
			width: xPosition,
			...inlineTrackStyle,
		};

		const railContainerStyles: CSSProperties = {
			position: 'relative',
			width,
		};

		const className = classnames(theme.container, {
			[theme.container_isDisabled as string]: isDisabled,
		});

		return (
			<div style={railContainerStyles} className={className}>
				<div style={trackStyles} className={theme.track} />
				<div className={theme.rail} ref={this.rail} onClick={this.handleClick} />
				<div className={theme.handleContainer}>
					<Rnd
						position={position}
						dragAxis={'x'}
						onDrag={this.handleDrag}
						bounds="parent"
						disableDragging={isDisabled}
						minWidth={0}
						enableResizing={{
							top: false,
							right: false,
							bottom: false,
							left: false,
							topRight: false,
							bottomRight: false,
							bottomLeft: false,
							topLeft: false,
						}}
						default={{
							x: 0,
							y: 0,
							width: 'auto',
							height: 'auto',
						}}>
						<SliderHandler theme={theme} />
					</Rnd>
				</div>
			</div>
		);
	}

	private handleClick: MouseEventHandler<HTMLElement> = event => {
		const { pageX } = event;
		const rail = this.rail.current;
		if (rail) {
			const bound = rail.getBoundingClientRect();
			const position = pageX - bound.left;
			this.props.onValueChange(this.state.xScale.invert(position));
		}
	};

	private handleDrag = (event: Event, data: DraggableData) =>
		this.props.onValueChange(this.state.xScale.invert(data.x));

	private buildScale(width: number, min: number, max: number): ScaleLinear<number, number> {
		return scaleLinear()
			.domain([min, max])
			.range([0, width]);
	}
}

const wTheme = {
	...css,
};

export type TSliderProps = PartialKeys<TFullSliderProps, 'theme' | 'SliderHandler' | 'isDisabled'>;

type Defaults = 'SliderHandler' | 'isDisabled';
const defaults = withDefaults<TFullSliderProps, Defaults>({
	isDisabled: false,
	SliderHandler,
});

export const Slider: ComponentClass<TSliderProps> = withTheme(SLIDER, wTheme)(defaults(RawSlider));
