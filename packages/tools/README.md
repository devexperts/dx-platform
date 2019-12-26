[![build status](https://img.shields.io/travis/devexperts/dx-platform/master.svg?style=flat-square)](https://travis-ci.org/devexperts/dx-platform) ![npm](https://img.shields.io/npm/v/@devexperts/tools.svg?style=flat-square) 
## @devexperts/tools
Build tooling for Devexperts frontend team projects. 

Usage:
```
dx-tools <command>
```
Commands are located under `src/scripts` directory. Some of available commands:
#### build-lib
```
dx-tools build-lib <src-path> <dist-path> [-w|--watch] [-f|--failOnError] [-p|--project <relative path to custom tsconfig.json>]
```
Builds projects using following rules:
* __Typescript__ - transpile `*.ts|*.tsx` files, produce `*.js|*.jsx` & `*.d.ts` files, run type checking service in background
* __Stylus__ - copy to _dist-path_ __as-is__. Compilation of stylus files is not included.
* __svg & other types of files__ - copy as-is.

Flags:
* `--watch` - run in watch mode
* `--failOnError` - if set, build process will return error code `1` in case of any Typescript compilation errors. Used for CI.
* `--project <relative path to custom tsconfig.json>` - if set, build process will be using specified typescript configuration file.
#### storybook
```
dx-tools storybook -c <config-path> [-p|--port <port>] [-h|--host <hostname>]
```
Run storybook with predefined config in watch mode.
* `--port <port>` - Set custom port. Default - `9001`.
* `--host <hostname>` - Set custom hostname. Default - `localhost`.
#### clean
```
dx-tools clean <path>
```
Remove dist folder before fresh build.
