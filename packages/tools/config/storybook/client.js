import { configure } from '@kadira/storybook';
// import * as ENV from '../env';

console.log(SRC_PATH);
const req = require.context(SRC_PATH, true, /\.page\.tsx$/);

configure(() => {
	req.keys()
		.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
		.map(req => {console.log('qq', req); return req;})
		.forEach(req);
}, module);