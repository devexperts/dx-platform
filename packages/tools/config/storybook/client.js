import { configure } from '@kadira/storybook';

const req = require.context(SRC_PATH, true, /\.page\.tsx$/);

configure(() => {
	req.keys()
		.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
		.forEach(req);
}, module);