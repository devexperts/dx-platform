import * as React from 'react';
import { Button } from './button';
import styled, { createGlobalStyle } from 'styled-components';

export default {
	title: 'Components/Atoms/Button',
	component: Button,
};

const AllDemo = styled.div`
	${Button} {
		margin-right: 16px;
	}
`;

const GlobalStyles = createGlobalStyle`
	#root ${AllDemo} {
		padding-left: 16px;
	}
	
	#docs-root .sbdocs-content {
	}
`;

export const All = () => (
	<AllDemo>
		<GlobalStyles />
		<Primary />
		<Button type={'secondary'}>Secondary</Button>
		<Button type={'tertiary'}>Tertiary</Button>
		<Button type={'sell'}>Sell</Button>
		<Button type={'buy'}>Buy</Button>
		{/*<Button*/}
		{/*	type={select<ButtonType>('type', ['primary', 'secondary', 'tertiary', 'sell', 'buy'], 'secondary')}*/}
		{/*	isDisabled={boolean('isDisabled', false)}>*/}
		{/*	{text('content', 'Text')}*/}
		{/*</Button>*/}
	</AllDemo>
);

export const Primary = () => <Button type={'primary'}>Primary</Button>;
Primary.story = {
	parameters: {
		docs: {
			storyDescription: 'Indicates a key action. There can be only one main button on the screen.',
		},
	},
};
export const Secondary = () => <Button type={'secondary'}>Secondary</Button>;
Secondary.story = {
	parameters: {
		docs: {
			storyDescription: 'Indicates a additional action. There can be few secondary button on screen.',
		},
	},
};
