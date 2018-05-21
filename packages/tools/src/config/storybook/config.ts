import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { withKnobs } from '@storybook/addon-knobs';

setOptions({
	name: 'Storybook',
	goFullScreen: false,
	showStoriesPanel: true,
	showAddonsPanel: true,
	showSearchBox: false,
	addonPanelInRight: true,
	sortStoriesByKind: false,
	hierarchySeparator: /\./,
	hierarchyRootSeparator: /\|/,
} as any);

addDecorator(withKnobs);

declare var SRC_PATH: string;

console.log('sdrs=>', SRC_PATH);

const req = require.context(SRC_PATH, true, /\.page\.tsx$/);

configure(function() {
	req
		.keys()
		.sort(function(a, b) {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		})
		.forEach(req);
}, module);
