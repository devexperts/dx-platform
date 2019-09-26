import React, { FC, useEffect } from 'react';
import {
	anchorBlockIdFromId,
	DocsContext,
	DocsContextProps,
	storyBlockIdFromId,
} from '@storybook/addon-docs/dist/blocks';
import { GlobalDemoStyles } from './global-demo-styles';
import styled, { createGlobalStyle } from 'styled-components';
import { ensure, ThemeProvider } from '@storybook/theming';

interface DocsContainerProps {
	context: DocsContextProps;
}

const Wrapper = styled.div`
	padding-top: 62px;
	padding-left: 79px;
	padding-bottom: 62px;
	padding-right: 79px;
`;
const Content = styled.div`
	max-width: 723px;
`;

const GlobalDocsStyle = createGlobalStyle`
	body {
		background-color: #ffffff;
		color: #000000;
	}
	
	.sbdocs-p {
		font-size: 16px;
		line-height: 1.5;
	}
`;

export const DocsContainer: FC<DocsContainerProps> = props => {
	const {
		context: { id },
	} = props;
	useEffect(() => {
		if (id) {
			const element =
				document.getElementById(anchorBlockIdFromId(id)) || document.getElementById(storyBlockIdFromId(id));
			if (element) {
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'end',
					inline: 'nearest',
				});
			}
		}
	}, [id]);

	return (
		<DocsContext.Provider value={props.context}>
			<ThemeProvider theme={ensure(props.context.parameters.options.theme)}>
				<GlobalDemoStyles />
				<GlobalDocsStyle />
				<Wrapper>
					<Content>{props.children}</Content>
				</Wrapper>
			</ThemeProvider>
		</DocsContext.Provider>
	);
};
