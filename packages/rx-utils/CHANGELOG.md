# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.17.0"></a>
# [0.17.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.16.2...v0.17.0) (2018-09-25)


### Bug Fixes

* headers order and body serialization ([5013cbe](https://github.com/devex-web-frontend/dx-platform/commit/5013cbe))
* **rx-utils:** remove unnecessary argument from THandler<A>['handle'] ([f57b5de](https://github.com/devex-web-frontend/dx-platform/commit/f57b5de))
* **rx-utils:** switchMapRD operator now returns correct observable for RemoteInitial, RemotePending and RemoteFailure cases ([4733eb2](https://github.com/devex-web-frontend/dx-platform/commit/4733eb2))


### Features

* add combineLatestRD ([df6efc2](https://github.com/devex-web-frontend/dx-platform/commit/df6efc2))
* **rx-utils:** introduce isAjaxError type guard ([#73](https://github.com/devex-web-frontend/dx-platform/issues/73)) ([2a90db9](https://github.com/devex-web-frontend/dx-platform/commit/2a90db9))


### BREAKING CHANGES

* **rx-utils:** call to THandler<void>['handle'](undefined) is now invalid and throw compile-time error




<a name="0.16.2"></a>
## [0.16.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.16.1...v0.16.2) (2018-09-20)




**Note:** Version bump only for package @devexperts/rx-utils

<a name="0.16.1"></a>
## [0.16.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.16.0...v0.16.1) (2018-09-19)




**Note:** Version bump only for package @devexperts/rx-utils
