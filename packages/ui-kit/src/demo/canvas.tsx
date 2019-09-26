import React from 'react';
import { GlobalDemoStyles } from './global-demo-styles';
import { StoryContext, StoryFn } from '@storybook/addons';
import styled from 'styled-components';

const Canvas = styled.div`
	padding: 27px 24px;
`;

export const withCanvas = (fn: StoryFn<JSX.Element>, c: StoryContext): ReturnType<StoryFn<JSX.Element>> => (
	<Canvas>
		<GlobalDemoStyles />
		{fn(c)}
	</Canvas>
);
