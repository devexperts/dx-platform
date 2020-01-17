import React from 'react';
import { storiesOf } from '@storybook/react';
import Demo from '../demo/Demo';
import { Menu, MenuItem, MenuItemGroup } from './Menu';

import css from './Menu.page.styl';

const theme = {
	container: css.list,
};

const Item = (props: any) => <MenuItem {...props} theme={theme} />;
const Group = (props: any) => <MenuItemGroup {...props} theme={theme} />;

const onItemSelect = (value: any) => {
	console.log('selected', value);
};

storiesOf('Menu', module).add('default', () => {
	return (
		<Demo>
			<Menu onItemSelect={onItemSelect} theme={theme}>
				<Item value="1.1">1.1</Item>
				<Item value="1.2">1.2</Item>
				<Group header="2">
					<Menu>
						<Item value="2.1">2.1</Item>
						<Item value="2.2">2.2</Item>
						<Group header="3">
							<Menu>
								<Item value="3.1">3.1</Item>
								<Item value="3.2">3.2</Item>
								<Group header="3.3">
									<Menu>
										<Item value="3.3.1">3.3.1</Item>
										<Item value="3.3.2">3.3.2</Item>
										<Item value="3.3.3">3.3.3</Item>
									</Menu>
								</Group>
								<Item value="3.4">3.4</Item>
							</Menu>
						</Group>
					</Menu>
				</Group>
			</Menu>
		</Demo>
	);
});
