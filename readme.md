[![build status](https://img.shields.io/travis/devex-web-frontend/dx-platform/master.svg?style=flat-square)](https://travis-ci.org/devex-web-frontend/dx-platform)

# dx-platform

## Contribution Prerequisites

- You have Node installed at v8.0.0+ and Yarn at v1.2.0+.

## Development Workflow

dx-platform is a monorepo project.

After cloning, run ``yarn`` to fetch dependencies for all packages. Then, run ``yarn lerna run prepare`` to build all packages.

Also you can run several commands:

- ``yarn test`` — checks codestyle and run tests for all packages.
- ``yarn lerna run watch --parallel`` — runs watch task for each package in parallel. You can manage scope of packages using ``--scope [glob]`` flag (see [lerna](https://github.com/lerna/lerna#--scope-glob) documentation for details)

## Commit name convention
https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits

## Publish
`--conventional-commit` flag enabled by `lerna.json` file.
It forces bump version to next major if breaking changes was introduced.
To avoid this behaviour during `0.x` phase use `yarn lerna publish --cd-version <minor|patch> --force-publish=*` for publishing.
