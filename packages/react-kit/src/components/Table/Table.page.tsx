import React from 'react';
import { storiesOf } from '@storybook/react';
import { Table, TableCell as Cell, TableHead as THead, TableBody as TBody, TableRow as Tr } from './Table';
import Demo from '../demo/Demo';
import css from './Table.page.styl';

const firstTheme = {
	cell: css.cell_first,
};

const secondStyle = {
	width: 200,
};

storiesOf('Table', module).add('default', () => (
	<Demo>
		<Table>
			<THead>
				<Tr isInHead={true}>
					<Cell rowSpan={2} theme={firstTheme}>
						1
					</Cell>
					<Cell style={secondStyle}>2</Cell>
					<Cell>3</Cell>
				</Tr>
				<Tr>
					<Cell colSpan={2}>_________colspan_________</Cell>
				</Tr>
			</THead>
			<TBody>
				<Tr>
					<Cell rowSpan={2}>________4_________</Cell>
					<Cell colSpan={2}>________5_________</Cell>
				</Tr>
				<Tr>
					<Cell>_8_</Cell>
					<Cell>_9_</Cell>
				</Tr>
			</TBody>
		</Table>
	</Demo>
));
