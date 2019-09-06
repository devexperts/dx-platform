import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';

addParameters({
	name: 'Storybook',
	isFullscreen: false,
	showStoriesPanel: true,
	showAddonsPanel: true,
	showSearchBox: false,
	panelPosition: 'right',
	sortStoriesByKind: false,
	hierarchySeparator: /\./,
	hierarchyRootSeparator: /\|/,
});

addDecorator(withKnobs);

// eslint-disable-next-line no-var
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
