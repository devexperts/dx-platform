import React from 'react';
import { storiesOf } from '@storybook/react';
import Demo from '../demo/Demo';
import { PURE } from '../../utils/pure';

import { Grid, GridHead as Head, GridBody as Body, GridRow as Row, GridCell as Cell, GridCellAlignment } from './Grid';

import css from './Grid.demo.styl';

const gridTheme = {
	container: css.container,
	gridBody: css.gridBody,
	gridHead: css.gridHead,
	gridHead_paddedForScrollbar: css.gridHead_paddedForScrollbar,
	gridCell__placeholder: css.gridCell__placeholder,
	gridCell__content: css.gridCell__content,
	gridCell__content_left: css.gridCell__content_left,
	gridCell__content_center: css.gridCell__content_center,
	gridCell__content_right: css.gridCell__content_right,
	horizontal_scrollbar__bar: css.horizontal_scrollbar__bar,
	vertical_scrollbar__bar: css.vertical_scrollbar__bar,
};

@PURE
class GridPage extends React.Component {
	state = {
		isLong: true,
		counter: 0,
	};

	_interval1: any;
	_interval2: any;

	componentDidMount() {
		// this._interval1 = setInterval(() => {
		// 	this.setState({
		// 		isLong: !this.state.isLong
		// 	});
		// }, 3000);

		this._interval2 = setInterval(() => {
			this.setState({
				counter: this.state.counter + 1,
			});
		}, 1000);
	}

	componentWillUnmount() {
		clearTimeout(this._interval1);
		clearInterval(this._interval2);
	}

	render() {
		return (
			<Demo>
				<Grid theme={gridTheme}>
					<Head theme={gridTheme}>
						<Row>
							<Cell align={GridCellAlignment.LEFT} theme={gridTheme}>
								1
							</Cell>
							<Cell theme={gridTheme}>
								{this.state.isLong ? '2_______________________________________' : '2'}
							</Cell>
							<Cell theme={gridTheme}>3</Cell>
						</Row>
					</Head>
					<Body theme={gridTheme}>
						{Array.from(new Array(20), () => 0).map((_, i) => (
							<Row key={i}>
								<Cell align={GridCellAlignment.LEFT} theme={gridTheme}>
									{this.state.counter}
								</Cell>
								<Cell theme={gridTheme}>2</Cell>
								<Cell theme={gridTheme}>3_______________________________________</Cell>
							</Row>
						))}
					</Body>
				</Grid>
			</Demo>
		);
	}
}

storiesOf('Grid', module).add('default', () => <GridPage />);
