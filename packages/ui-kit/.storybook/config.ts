import { addDecorator, addParameters, configure } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';
import { theme } from './theme';
// @ts-ignore
import { DocsPage } from '../src/demo/docs-page';
// @ts-ignore
import { DocsContainer } from '../src/demo/docs-container';
// @ts-ignore
import { withCanvas } from '../src/demo/canvas';

addDecorator(withKnobs());
addDecorator(withActions());
addDecorator(withCanvas);
addParameters({
	docs: {
		container: DocsContainer,
		page: DocsPage,
	},
	options: {
		theme,
	},
});
configure(require.context('../src', true, /\.stories\.tsx?$/), module);
