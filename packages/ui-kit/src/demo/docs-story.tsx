import { StoreItem } from '@storybook/client-api/dist/types';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/Either';
import React, { memo } from 'react';
import { boolean, string, type, TypeOf } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import styled from 'styled-components';
import { chain, getOrElse, map, Option, toNullable } from 'fp-ts/lib/Option';
import { Description, Preview, Story as SBStory } from '@storybook/addon-docs/dist/blocks';
import { constFalse } from 'fp-ts/lib/function';
import { styled as sbStyled } from '@storybook/theming';

const storyCodec = type({
	id: string,
	name: string,
	kind: string,
	withToolbar: optionFromNullable(boolean),
	parameters: type({
		docs: optionFromNullable(
			type({
				storyDescription: optionFromNullable(string),
			}),
		),
	}),
});
type Decoded = TypeOf<typeof storyCodec>;

const Container = styled.section`
	.sbdocs-p {
		margin-top: 0;
		margin-bottom: 19px;
	}
`;

const StoryTitle = styled.h1`
	font-size: 28px;
	font-weight: bold;
	color: #25252b;
	margin-bottom: 22px;
`;

const StoryPreview = sbStyled(Preview)`
	margin-top: 0;
`;

const Hr = styled.hr`
	border: none;
	height: 1px;
	background-color: #e1e6ed;
	margin-top: 0;
	margin-bottom: 24px;
`;

const Story = styled.div`
	background-color: #242729;
	border-radius: 2px;
	margin-bottom: 52px;
`;

interface DocsStoryProps {
	story: StoreItem;
}
export const DocsStory = memo((props: DocsStoryProps) => {
	const story = storyCodec.decode(props.story);
	return pipe(
		story,
		fold(
			e => {
				console.error('Unable to parse story Story', props.story, e);
				return <div>Unable to parse Story</div>;
			},
			story => {
				const description = pipe(
					getDescription(story),
					map(description => <Description markdown={description} />),
				);
				const withToolbar = pipe(
					story.withToolbar,
					getOrElse(constFalse),
				);
				return (
					<Container>
						<StoryTitle>{story.name}</StoryTitle>
						{toNullable(description)}
						<Hr />
						<Story>
							<SBStory id={story.id} />
						</Story>
					</Container>
				);
			},
		),
	);
});

function getDescription(story: Decoded): Option<string> {
	return pipe(
		story.parameters.docs,
		chain(d => d.storyDescription),
	);
}
