# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.24.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.6...v0.24.0) (2019-01-21)


### Bug Fixes

* **rx-utils:** fix deferContext ([83d431d](https://github.com/devex-web-frontend/dx-platform/commit/83d431d))


### BREAKING CHANGES

* **rx-utils:** removed instance of MonadReader for Context





## [0.23.6](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.3...v0.23.6) (2019-01-18)

**Note:** Version bump only for package @devexperts/platform





## [0.23.4](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.3...v0.23.4) (2019-01-18)

**Note:** Version bump only for package @devexperts/platform






<a name="0.23.3"></a>
## [0.23.3](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.2...v0.23.3) (2019-01-17)




**Note:** Version bump only for package @devexperts/platform

<a name="0.23.2"></a>
## [0.23.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.1...v0.23.2) (2019-01-17)


### Features

* **lint:** rename lint\.prettierrc to lint\.prettierrc.json for extend it in outside  ([#103](https://github.com/devex-web-frontend/dx-platform/issues/103)) ([#104](https://github.com/devex-web-frontend/dx-platform/issues/104)) ([908b324](https://github.com/devex-web-frontend/dx-platform/commit/908b324))




<a name="0.23.1"></a>
## [0.23.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.0...v0.23.1) (2019-01-17)


### Bug Fixes

* **react-kit, rx-utils:** run parseValue and formatValue in NumericStepper, expose keys$ in EntityStore ([e06bc7c](https://github.com/devex-web-frontend/dx-platform/commit/e06bc7c))




<a name="0.23.0"></a>
# [0.23.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.19.2...v0.23.0) (2018-12-18)


### Bug Fixes

* **react-kit:** Scrollable incorrectly sets content padding in Chrome and IE/FF ([#89](https://github.com/devex-web-frontend/dx-platform/issues/89)) ([8b11a7a](https://github.com/devex-web-frontend/dx-platform/commit/8b11a7a)), closes [#82](https://github.com/devex-web-frontend/dx-platform/issues/82)


* Feature/new utils (#99) ([b0d3105](https://github.com/devex-web-frontend/dx-platform/commit/b0d3105)), closes [#99](https://github.com/devex-web-frontend/dx-platform/issues/99)


### Features

* **react-kit:** Add ability to display content under scrollbars ([#97](https://github.com/devex-web-frontend/dx-platform/issues/97)) ([5304dc5](https://github.com/devex-web-frontend/dx-platform/commit/5304dc5))
* **react-kit:** Closing root close correctly ([#93](https://github.com/devex-web-frontend/dx-platform/issues/93)) ([af7c011](https://github.com/devex-web-frontend/dx-platform/commit/af7c011))
* **react-kit:** Date input add inner ref ([#91](https://github.com/devex-web-frontend/dx-platform/issues/91)) ([8ac4e80](https://github.com/devex-web-frontend/dx-platform/commit/8ac4e80))
* **react-kit:** Selectbox. Make component controlled by isOpened prop ([c2e7991](https://github.com/devex-web-frontend/dx-platform/commit/c2e7991))
* **utils:** add more reader combine overloads ([#92](https://github.com/devex-web-frontend/dx-platform/issues/92)) ([a8f6ad8](https://github.com/devex-web-frontend/dx-platform/commit/a8f6ad8))


### BREAKING CHANGES

* **react-kit:** Selectbox props "isOpened" and "onToggle" are now required. Use stateful() to make it uncontrolled.
* TRenderRemoteDataStates accepts 1 type-parameter, TRenderRemoteDataProps and RenderRemoteData accept 2 type-parameters. renderPending, renderSuccess and renderFailure are moved to prototype

* chore(rx-utils): Use Array.sequence instead of Traversable.sequence (fp-ts deprecation)

* chore(utils): Replace reader helpers with generalized from MonadReader and ProductLeft. Add sequenceTReader, ReaderValueType, ReaderEnvType and extended instance
* ProjectMany is removed, combine is renamed to combineReader, defer is renamed to deferReader

* chore(utils): rename product-coproduct module to product-left-coproduct-left

* fix(utils): Relax memoized signature for new TS

* chore(rx-utils): fix incorrect type inference for Context

* feat(utils): Add CoproductLeft instance to either, add sequenceTEither, sequenceEither and combineEither

* feat(utils): Add LeftType and RightType to Either

* chore: bump tslint@^5.11.0

* style: fix

* feat(utils): Add missing overloading from old Reader combine
* **react-kit:** move types for dateInput out of component to make the model independent




<a name="0.22.1"></a>
## [0.22.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.19.2...v0.22.1) (2018-12-13)


### Bug Fixes

* **react-kit:** Scrollable incorrectly sets content padding in Chrome and IE/FF ([#89](https://github.com/devex-web-frontend/dx-platform/issues/89)) ([8b11a7a](https://github.com/devex-web-frontend/dx-platform/commit/8b11a7a)), closes [#82](https://github.com/devex-web-frontend/dx-platform/issues/82)


* Feature/new utils (#99) ([b0d3105](https://github.com/devex-web-frontend/dx-platform/commit/b0d3105)), closes [#99](https://github.com/devex-web-frontend/dx-platform/issues/99)


### Features

* **react-kit:** Add ability to display content under scrollbars ([#97](https://github.com/devex-web-frontend/dx-platform/issues/97)) ([5304dc5](https://github.com/devex-web-frontend/dx-platform/commit/5304dc5))
* **react-kit:** Closing root close correctly ([#93](https://github.com/devex-web-frontend/dx-platform/issues/93)) ([af7c011](https://github.com/devex-web-frontend/dx-platform/commit/af7c011))
* **react-kit:** Date input add inner ref ([#91](https://github.com/devex-web-frontend/dx-platform/issues/91)) ([8ac4e80](https://github.com/devex-web-frontend/dx-platform/commit/8ac4e80))
* **utils:** add more reader combine overloads ([#92](https://github.com/devex-web-frontend/dx-platform/issues/92)) ([a8f6ad8](https://github.com/devex-web-frontend/dx-platform/commit/a8f6ad8))


### BREAKING CHANGES

* TRenderRemoteDataStates accepts 1 type-parameter, TRenderRemoteDataProps and RenderRemoteData accept 2 type-parameters. renderPending, renderSuccess and renderFailure are moved to prototype

* chore(rx-utils): Use Array.sequence instead of Traversable.sequence (fp-ts deprecation)

* chore(utils): Replace reader helpers with generalized from MonadReader and ProductLeft. Add sequenceTReader, ReaderValueType, ReaderEnvType and extended instance
* ProjectMany is removed, combine is renamed to combineReader, defer is renamed to deferReader

* chore(utils): rename product-coproduct module to product-left-coproduct-left

* fix(utils): Relax memoized signature for new TS

* chore(rx-utils): fix incorrect type inference for Context

* feat(utils): Add CoproductLeft instance to either, add sequenceTEither, sequenceEither and combineEither

* feat(utils): Add LeftType and RightType to Either

* chore: bump tslint@^5.11.0

* style: fix

* feat(utils): Add missing overloading from old Reader combine
* **react-kit:** move types for dateInput out of component to make the model independent




<a name="0.22.0"></a>
# [0.22.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.21.0...v0.22.0) (2018-11-26)




**Note:** Version bump only for package @devexperts/platform

<a name="0.21.0"></a>
# [0.21.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.20.0...v0.21.0) (2018-11-26)




**Note:** Version bump only for package @devexperts/platform

<a name="0.20.0"></a>
# [0.20.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.19.2...v0.20.0) (2018-11-26)


### Features

* **react-kit:** Date input add inner ref ([#91](https://github.com/devex-web-frontend/dx-platform/issues/91)) ([8ac4e80](https://github.com/devex-web-frontend/dx-platform/commit/8ac4e80))
* **utils:** add more reader combine overloads ([#92](https://github.com/devex-web-frontend/dx-platform/issues/92)) ([a8f6ad8](https://github.com/devex-web-frontend/dx-platform/commit/a8f6ad8))


### BREAKING CHANGES

* **react-kit:** move types for dateInput out of component to make the model independent




<a name="0.19.2"></a>
## [0.19.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.19.1...v0.19.2) (2018-10-31)


### Features

* **react-kit:** add props for all mouse and touch events ([#90](https://github.com/devex-web-frontend/dx-platform/issues/90)) ([072ab37](https://github.com/devex-web-frontend/dx-platform/commit/072ab37))




<a name="0.19.1"></a>
## [0.19.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.19.0...v0.19.1) (2018-10-30)


### Bug Fixes

* render correct month ([#86](https://github.com/devex-web-frontend/dx-platform/issues/86)) ([b780e75](https://github.com/devex-web-frontend/dx-platform/commit/b780e75))




<a name="0.19.0"></a>
# [0.19.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.18.3...v0.19.0) (2018-10-17)


### Features

* **react-kit:** accept defaultProps in withrx selector result ([#83](https://github.com/devex-web-frontend/dx-platform/issues/83)) ([471706f](https://github.com/devex-web-frontend/dx-platform/commit/471706f)), closes [/github.com/Microsoft/TypeScript/issues/15005#issuecomment-430588884](https://github.com//github.com/Microsoft/TypeScript/issues/15005/issues/issuecomment-430588884)


### BREAKING CHANGES

* **react-kit:** - `defaultProps` argument is moved to `WithRXSelectorResult`; 
- `static defaultProps` property is removed; 
- `props$` stream passed to `selector` doesn't contain fields from `defaultProps` anymore
- `withRX` now accepts `Target` separately for better type inference in `props`/`defaultProps`

* chore(react-kit): update with-rx typechecking test




<a name="0.18.3"></a>
## [0.18.3](https://github.com/devex-web-frontend/dx-platform/compare/v0.18.2...v0.18.3) (2018-10-16)


### Bug Fixes

* **react-kit:** fix invalid defaultProps typings ([#81](https://github.com/devex-web-frontend/dx-platform/issues/81)) ([15e949a](https://github.com/devex-web-frontend/dx-platform/commit/15e949a))




<a name="0.18.2"></a>
## [0.18.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.18.1...v0.18.2) (2018-10-15)


### Bug Fixes

* **react-kit:** fix invalid module reference ([8ceab0a](https://github.com/devex-web-frontend/dx-platform/commit/8ceab0a))




<a name="0.18.1"></a>
## [0.18.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.18.0...v0.18.1) (2018-10-10)


### Features

* **react-kit:** update withRX ([#78](https://github.com/devex-web-frontend/dx-platform/issues/78)) ([18a251f](https://github.com/devex-web-frontend/dx-platform/commit/18a251f)), closes [#69](https://github.com/devex-web-frontend/dx-platform/issues/69)




<a name="0.18.0"></a>
# [0.18.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.17.1...v0.18.0) (2018-10-04)


### Features

* **react-kit:** change DateInput workflow ([#77](https://github.com/devex-web-frontend/dx-platform/issues/77)) ([88f9a81](https://github.com/devex-web-frontend/dx-platform/commit/88f9a81))


### BREAKING CHANGES

* **react-kit:** DateInput is now fully controlled and works with Option




<a name="0.17.1"></a>
## [0.17.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.17.0...v0.17.1) (2018-09-26)


### Reverts

* **rx-utils:** fix createHandler ([#76](https://github.com/devex-web-frontend/dx-platform/issues/76)) ([a7a580f](https://github.com/devex-web-frontend/dx-platform/commit/a7a580f))




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
