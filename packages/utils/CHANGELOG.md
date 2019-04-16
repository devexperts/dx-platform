# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.28.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.28.1...v0.28.2) (2019-04-16)

**Note:** Version bump only for package @devexperts/utils





## [0.28.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.28.0...v0.28.1) (2019-04-11)

**Note:** Version bump only for package @devexperts/utils






# [0.28.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.27.0...v0.28.0) (2019-03-22)

**Note:** Version bump only for package @devexperts/utils





# [0.27.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.26.0...v0.27.0) (2019-03-12)

**Note:** Version bump only for package @devexperts/utils






# [0.26.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.25.0...v0.26.0) (2019-02-04)

**Note:** Version bump only for package @devexperts/utils






# [0.25.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.24.0...v0.25.0) (2019-01-23)

**Note:** Version bump only for package @devexperts/utils





# [0.24.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.6...v0.24.0) (2019-01-21)

**Note:** Version bump only for package @devexperts/utils





## [0.23.6](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.3...v0.23.6) (2019-01-18)

**Note:** Version bump only for package @devexperts/utils





## [0.23.4](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.3...v0.23.4) (2019-01-18)

**Note:** Version bump only for package @devexperts/utils






<a name="0.23.3"></a>
## [0.23.3](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.2...v0.23.3) (2019-01-17)




**Note:** Version bump only for package @devexperts/utils

<a name="0.23.2"></a>
## [0.23.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.1...v0.23.2) (2019-01-17)




**Note:** Version bump only for package @devexperts/utils

<a name="0.23.1"></a>
## [0.23.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.0...v0.23.1) (2019-01-17)




**Note:** Version bump only for package @devexperts/utils

<a name="0.23.0"></a>
# [0.23.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.19.2...v0.23.0) (2018-12-18)


### Features

* **utils:** add more reader combine overloads ([#92](https://github.com/devex-web-frontend/dx-platform/issues/92)) ([a8f6ad8](https://github.com/devex-web-frontend/dx-platform/commit/a8f6ad8))


* Feature/new utils (#99) ([b0d3105](https://github.com/devex-web-frontend/dx-platform/commit/b0d3105)), closes [#99](https://github.com/devex-web-frontend/dx-platform/issues/99)


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




<a name="0.22.1"></a>
## [0.22.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.19.2...v0.22.1) (2018-12-13)


### Features

* **utils:** add more reader combine overloads ([#92](https://github.com/devex-web-frontend/dx-platform/issues/92)) ([a8f6ad8](https://github.com/devex-web-frontend/dx-platform/commit/a8f6ad8))


* Feature/new utils (#99) ([b0d3105](https://github.com/devex-web-frontend/dx-platform/commit/b0d3105)), closes [#99](https://github.com/devex-web-frontend/dx-platform/issues/99)


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




<a name="0.22.0"></a>
# [0.22.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.21.0...v0.22.0) (2018-11-26)




**Note:** Version bump only for package @devexperts/utils

<a name="0.21.0"></a>
# [0.21.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.20.0...v0.21.0) (2018-11-26)




**Note:** Version bump only for package @devexperts/utils

<a name="0.20.0"></a>
# [0.20.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.19.2...v0.20.0) (2018-11-26)


### Features

* **utils:** add more reader combine overloads ([#92](https://github.com/devex-web-frontend/dx-platform/issues/92)) ([a8f6ad8](https://github.com/devex-web-frontend/dx-platform/commit/a8f6ad8))




<a name="0.19.2"></a>
## [0.19.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.19.1...v0.19.2) (2018-10-31)




**Note:** Version bump only for package @devexperts/utils

<a name="0.19.1"></a>
## [0.19.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.19.0...v0.19.1) (2018-10-30)




**Note:** Version bump only for package @devexperts/utils

<a name="0.19.0"></a>
# [0.19.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.18.3...v0.19.0) (2018-10-17)




**Note:** Version bump only for package @devexperts/utils

<a name="0.18.3"></a>
## [0.18.3](https://github.com/devex-web-frontend/dx-platform/compare/v0.18.2...v0.18.3) (2018-10-16)




**Note:** Version bump only for package @devexperts/utils

<a name="0.18.2"></a>
## [0.18.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.18.1...v0.18.2) (2018-10-15)




**Note:** Version bump only for package @devexperts/utils

<a name="0.18.1"></a>
## [0.18.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.18.0...v0.18.1) (2018-10-10)




**Note:** Version bump only for package @devexperts/utils

<a name="0.18.0"></a>
# [0.18.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.17.1...v0.18.0) (2018-10-04)




**Note:** Version bump only for package @devexperts/utils

<a name="0.17.1"></a>
## [0.17.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.17.0...v0.17.1) (2018-09-26)




**Note:** Version bump only for package @devexperts/utils

<a name="0.17.0"></a>
# [0.17.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.16.2...v0.17.0) (2018-09-25)


### Features

* **utils:** add defer to Reader ([14cd0fa](https://github.com/devex-web-frontend/dx-platform/commit/14cd0fa))




<a name="0.16.2"></a>
## [0.16.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.16.1...v0.16.2) (2018-09-20)




**Note:** Version bump only for package @devexperts/utils

<a name="0.16.1"></a>
## [0.16.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.16.0...v0.16.1) (2018-09-19)




**Note:** Version bump only for package @devexperts/utils
