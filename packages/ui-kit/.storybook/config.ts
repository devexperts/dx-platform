import { addDecorator, addParameters, configure } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';
import { DocsContainer, DocsPage } from '@storybook/addon-docs/dist/blocks';

addDecorator(withKnobs());
addDecorator(withActions());
addParameters({
	docs: {
		container: DocsContainer,
		page: DocsPage,
	},
});
configure(require.context('../src', true, /\.stories\.tsx?$/), module);
