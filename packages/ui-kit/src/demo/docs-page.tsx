import React, { FC } from 'react';
import {
	Description,
	DocsContext,
	DocsContextProps,
	DocsPageProps,
	getPropsTableProps,
} from '@storybook/addon-docs/dist/blocks';
import { PropsTableProps, PropsTable } from '@storybook/components';
import styled from 'styled-components';
import { chain, getOrElse, Option, map, toNullable, alt } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { parseKind } from '@storybook/router';
import { last } from 'fp-ts/lib/Array';
import { string, type, TypeOf } from 'io-ts';
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import { regexp } from 'io-ts-types/lib/regexp';
import { fold } from 'fp-ts/lib/Either';
import { fromRefinement } from 'io-ts-types/lib/fromRefinement';
import StoryStore from '@storybook/client-api/dist/story_store';
import { DocsStory } from './docs-story';

const contextCodec = type({
	selectedKind: string,
	parameters: optionFromNullable(
		type({
			component: optionFromNullable(
				type({
					displayName: optionFromNullable(string),
					__docgenInfo: optionFromNullable(
						type({
							description: optionFromNullable(string),
						}),
					),
				}),
			),
			options: optionFromNullable(
				type({
					hierarchyRootSeparator: optionFromNullable(string),
					hierarchySeparator: optionFromNullable(regexp),
				}),
			),
		}),
	),
	storyStore: fromRefinement('StoryStore', (u): u is StoryStore => u instanceof StoryStore),
});
type Context = TypeOf<typeof contextCodec>;

const Title = styled.h1`
	font-size: 36px;
	font-weight: bold;
	color: #25252b;
	margin-bottom: 19px;
`;

export const DocsPage: FC<DocsPageProps> = () => (
	<DocsContext.Consumer>
		{raw =>
			pipe(
				contextCodec.decode(raw),
				fold(
					error => {
						console.error('Unable to parse DocsContextProps', raw, error);
						return <div>Unable to parse DocsContextProps</div>;
					},
					context => {
						const title = pipe(
							getTitle(context),
							map(title => <Title>{title}</Title>),
						);
						const description = pipe(
							getDescription(context),
							map(description => <Description markdown={description} />),
						);
						const props = getProps(raw);
						const stories = context.storyStore.getStoriesForKind(context.selectedKind);
						return (
							<section>
								{toNullable(title)}
								{toNullable(description)}
								{stories.map(story => (
									<DocsStory key={story.id} story={story} />
								))}

								<PropsTable {...props} />
							</section>
						);
					},
				),
			)
		}
	</DocsContext.Consumer>
);

function getTitle(context: Context): Option<string> {
	const displayName = pipe(
		context.parameters,
		chain(p => p.component),
		chain(c => c.displayName),
	);
	return pipe(
		displayName,
		alt(() => {
			const options = pipe(
				context.parameters,
				chain(p => p.options),
			);
			const rootSeparator = pipe(
				options,
				chain(o => o.hierarchyRootSeparator),
				getOrElse(() => '|'),
			);
			const groupSeparator = pipe(
				options,
				chain(o => o.hierarchySeparator),
				getOrElse(() => /[\/.]/),
			);
			const parsed = parseKind(context.selectedKind, { rootSeparator, groupSeparator });
			return last(parsed.groups);
		}),
	);
}

function getDescription(context: Context): Option<string> {
	return pipe(
		context.parameters,
		chain(p => p.component),
		chain(c => c.__docgenInfo),
		chain(i => i.description),
	);
}

function getProps(raw: DocsContextProps): PropsTableProps {
	return getPropsTableProps({ of: '.' }, raw);
}
