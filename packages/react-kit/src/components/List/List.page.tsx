import React from 'react';
import { storiesOf } from '@storybook/react';
import Demo from '../demo/Demo';
import { List, ListItem, ListItemGroup } from './List';

import css from './List.page.styl';

const theme = {
	container: css.list,
};

storiesOf('List', module).add('default', () => {
	return (
		<Demo>
			<List theme={theme}>
				<ListItem>1.1</ListItem>
				<ListItem>1.2</ListItem>
				<ListItemGroup header={2}>
					<List>
						<ListItem>2.1</ListItem>
						<ListItem>2.2</ListItem>
						<ListItemGroup header={3}>
							<List>
								<ListItem>3.1</ListItem>
								<ListItem>3.2</ListItem>
								<ListItemGroup header={4}>
									<List>
										<ListItem>4.1</ListItem>
										<ListItem>4.2</ListItem>
										<ListItem>4.3</ListItem>
									</List>
								</ListItemGroup>
								<ListItem>3.3</ListItem>
							</List>
						</ListItemGroup>
					</List>
				</ListItemGroup>
				<ListItem>1.3</ListItem>
			</List>
		</Demo>
	);
});
