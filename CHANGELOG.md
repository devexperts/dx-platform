# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.17.0"></a>
# [0.17.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.16.2...v0.17.0) (2018-09-25)


### Bug Fixes

* headers order and body serialization ([5013cbe](https://github.com/devex-web-frontend/dx-platform/commit/5013cbe))
* **react-kit:** detect if scrolled node contains popover anchor ([#74](https://github.com/devex-web-frontend/dx-platform/issues/74)) ([78bb8b0](https://github.com/devex-web-frontend/dx-platform/commit/78bb8b0))
* **rx-utils:** remove unnecessary argument from THandler<A>['handle'] ([f57b5de](https://github.com/devex-web-frontend/dx-platform/commit/f57b5de))
* **rx-utils:** switchMapRD operator now returns correct observable for RemoteInitial, RemotePending and RemoteFailure cases ([4733eb2](https://github.com/devex-web-frontend/dx-platform/commit/4733eb2))


### Features

* add combineLatestRD ([df6efc2](https://github.com/devex-web-frontend/dx-platform/commit/df6efc2))
* **react-kit:** fix stateful types ([ed0bc96](https://github.com/devex-web-frontend/dx-platform/commit/ed0bc96))
* **rx-utils:** introduce isAjaxError type guard ([#73](https://github.com/devex-web-frontend/dx-platform/issues/73)) ([2a90db9](https://github.com/devex-web-frontend/dx-platform/commit/2a90db9))
* **utils:** add defer to Reader ([14cd0fa](https://github.com/devex-web-frontend/dx-platform/commit/14cd0fa))


### BREAKING CHANGES

* **rx-utils:** call to THandler<void>['handle'](undefined) is now invalid and throw compile-time error
* **react-kit:** stateful components now require explicit defaultValue, TControlProps now requires strict value/onValueChange




<a name="0.16.2"></a>
## [0.16.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.16.1...v0.16.2) (2018-09-20)


### Bug Fixes

* **react-kit:** fix popover closing on scroll inside ([#67](https://github.com/devex-web-frontend/dx-platform/issues/67)) ([b4416d7](https://github.com/devex-web-frontend/dx-platform/commit/b4416d7)), closes [#66](https://github.com/devex-web-frontend/dx-platform/issues/66)




<a name="0.16.1"></a>
## [0.16.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.16.0...v0.16.1) (2018-09-19)




**Note:** Version bump only for package @devexperts/platform

<a name="0.13.3"></a>
## [0.13.3](https://github.com/devex-web-frontend/dx-util/compare/v0.13.2...v0.13.3) (2018-07-17)




**Note:** Version bump only for package @devexperts/platform

<a name="0.13.2"></a>
## [0.13.2](https://github.com/devex-web-frontend/dx-util/compare/v0.13.1...v0.13.2) (2018-07-17)




**Note:** Version bump only for package @devexperts/platform
