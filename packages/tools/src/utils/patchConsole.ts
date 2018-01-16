import {PKG} from '../config/env';

export const patchConsole = (script: string) => {
    const metadata = `[${PKG.name}][${script}]`;

    require('console-stamp')(console, {
        formatter: () => '',
        datePrefix: `${metadata}`,
        dateSuffix: ''
    });

    const npmLoggers: any[] = [];

    try {
        const basicNpmLog = require('npmlog');
        npmLoggers.push(basicNpmLog);
    } catch (err) { }

    try {
        const storyBookLogger = require('@storybook/node_modules/node-logger/node_modules/npmlog');
        npmLoggers.push(storyBookLogger);
    } catch (err) { }

    npmLoggers.forEach(npmLogger => npmLogger.heading = metadata);
};
