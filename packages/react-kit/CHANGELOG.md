# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.10](https://github.com/devexperts/dx-platform/compare/v1.0.0-alpha.9...v1.0.0-alpha.10) (2020-01-17)


### Bug Fixes

* **tools:** update storybook packages ([48dc57c](https://github.com/devexperts/dx-platform/commit/48dc57cef69d909e4ef57dd79d6cd222c2f7ccc1))


### chore

* turn on esModuleInterop ([6b6f380](https://github.com/devexperts/dx-platform/commit/6b6f38005c8a2c20c1ec229ceb29eec8f2022ae6))


### BREAKING CHANGES

* esModuleInterop is turned on





# [1.0.0-alpha.9](https://github.com/devexperts/dx-platform/compare/v1.0.0-alpha.8...v1.0.0-alpha.9) (2020-01-15)


### Bug Fixes

* **react-kit:** fix useObservable disposal ([c9ed114](https://github.com/devexperts/dx-platform/commit/c9ed114e4f8f7cc8100f31fbddcf253a6aecab63))





# [1.0.0-alpha.8](https://github.com/devexperts/dx-platform/compare/v1.0.0-alpha.7...v1.0.0-alpha.8) (2020-01-15)

**Note:** Version bump only for package @devexperts/react-kit





# [1.0.0-alpha.7](https://github.com/devexperts/dx-platform/compare/v1.0.0-alpha.6...v1.0.0-alpha.7) (2020-01-14)


### Bug Fixes

* **rx-utils, react-kit:** fix imports from 'src' ([256e72b](https://github.com/devexperts/dx-platform/commit/256e72b350b160bed644a46b8e772262ea03af00))





# [1.0.0-alpha.6](https://github.com/devexperts/dx-platform/compare/v1.0.0-alpha.5...v1.0.0-alpha.6) (2020-01-14)

**Note:** Version bump only for package @devexperts/react-kit





# [1.0.0-alpha.5](https://github.com/devexperts/dx-platform/compare/v1.0.0-alpha.4...v1.0.0-alpha.5) (2019-12-17)


### Bug Fixes

* **react-kit:** fix eslint/tsc tsconfig.json conflict ([ee16e54](https://github.com/devexperts/dx-platform/commit/ee16e549e0bb7553a1a8552650f8e498afafb685))


### Code Refactoring

* **utils, react-kit:** cleanup ([70e1e3b](https://github.com/devexperts/dx-platform/commit/70e1e3bbd0c7d6d6b283466d7a56e834f5141de9))


### Features

* **react-kit:** layout ([34061dc](https://github.com/devexperts/dx-platform/commit/34061dcf8310745de47a1338a203539d63d0d321))
* **react-kit, utils:** useObservable hook and WithObservable HOC ([2885463](https://github.com/devexperts/dx-platform/commit/28854637503baa9bbe5cba595a46a472d4c2773d))


### BREAKING CHANGES

* **utils, react-kit:** removed bem, collection, dom/index, flux, function/function, function/disposable, function/identity, object/index, session, string/index modules
* **utils, react-kit:** removed react-kit/utils/disposable





# [1.0.0-alpha.4](https://github.com/devexperts/dx-platform/compare/v1.0.0-alpha.3...v1.0.0-alpha.4) (2019-10-25)

**Note:** Version bump only for package @devexperts/react-kit





# [1.0.0-alpha.3](https://github.com/devexperts/dx-platform/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2019-10-22)


### Bug Fixes

* **react-kit:** fix .d.ts file emission ([a169941](https://github.com/devexperts/dx-platform/commit/a169941))





# [1.0.0-alpha.2](https://github.com/devexperts/dx-platform/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2019-09-27)


### Build System

* migrate from tslint to eslint ([#160](https://github.com/devexperts/dx-platform/issues/160)) ([b6f3d37](https://github.com/devexperts/dx-platform/commit/b6f3d37))


### Features

* **react-kit:** Selectbox. Multiselect feature ([#173](https://github.com/devexperts/dx-platform/issues/173)) ([0586023](https://github.com/devexperts/dx-platform/commit/0586023))


### BREAKING CHANGES

* tslint config was removed





# [1.0.0-alpha.1](https://github.com/devexperts/dx-platform/compare/v1.0.0-alpha.0...v1.0.0-alpha.1) (2019-09-05)


### Build System

* **react-kit,tools:** update react and storybook ([ecf5070](https://github.com/devexperts/dx-platform/commit/ecf5070))


### Code Refactoring

* **react-kit:** drop `prop-types` ([96ced98](https://github.com/devexperts/dx-platform/commit/96ced98))
* **react-kit:** support new react typings ([743c0ea](https://github.com/devexperts/dx-platform/commit/743c0ea))


### BREAKING CHANGES

* **react-kit:** replaced `prop-types` validators with `constNull`s
* **react-kit:** - narrowed `Button`'s `type` prop
- narrows `Scrollable`'s `children` prop
* **react-kit,tools:** Peer dependencies were updated:
  - "@types/react": "^16.9.2",
  - "@types/react-dom": "^16.9.0",
  - "react": "^16.9.0",
  - "react-dom": "^16.9.0"
 
 
 





# [1.0.0-alpha.0](https://github.com/devexperts/dx-platform/compare/v0.29.1...v1.0.0-alpha.0) (2019-09-04)


### Build System

* update dependencies ([f59da99](https://github.com/devexperts/dx-platform/commit/f59da99))


### BREAKING CHANGES

* update dependencies:
  - @devexperts/remote-data-ts@^2.0.0
  - fp-ts@^2.0.5
  - ts-loader@^6.0.4
  - tslib@^1.10.0
  - tslint@^5.19.0
  - tslint-config-prettier@^1.18.0"
  - tslint-plugin-prettier@^2.0.1"
  - tsutils@^3.17.1
  - typelevel-ts@^0.3.5
  - typescript@^3.5.3





## [0.29.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.29.0...v0.29.1) (2019-07-03)

**Note:** Version bump only for package @devexperts/react-kit





# [0.29.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.28.3...v0.29.0) (2019-05-25)


### Code Refactoring

* **react-kit:** remove react-css-themr from deps ([#131](https://github.com/devex-web-frontend/dx-platform/issues/131)) ([41f0d86](https://github.com/devex-web-frontend/dx-platform/commit/41f0d86))


### maintain

* update babel@7, webpack@4 and storybook@5 ([#126](https://github.com/devex-web-frontend/dx-platform/issues/126)) ([4cd1cd5](https://github.com/devex-web-frontend/dx-platform/commit/4cd1cd5))


### BREAKING CHANGES

* **react-kit:** @CSS component decorator has been removed
* `utils/sotrybook.ts` is removed from `@devexperts/tools` package. Use direct import from `@storybook/*` instead






## [0.28.3](https://github.com/devex-web-frontend/dx-platform/compare/v0.28.2...v0.28.3) (2019-04-22)

**Note:** Version bump only for package @devexperts/react-kit





## [0.28.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.28.1...v0.28.2) (2019-04-16)


### Bug Fixes

* **react-kit:** Popover. If doesn't fit into container (with any placement), placement should be as set ([#122](https://github.com/devex-web-frontend/dx-platform/issues/122)) ([109b434](https://github.com/devex-web-frontend/dx-platform/commit/109b434))





## [0.28.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.28.0...v0.28.1) (2019-04-11)


### Bug Fixes

* **react-kit:** Input. Prevent to open DateInput popup on click if DateInput is disabled ([#124](https://github.com/devex-web-frontend/dx-platform/issues/124)) ([1818860](https://github.com/devex-web-frontend/dx-platform/commit/1818860))






# [0.28.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.27.0...v0.28.0) (2019-03-22)


### Features

* **react-kit:** LoadingIndication. Add timer for disable loader node in DOM ([#119](https://github.com/devex-web-frontend/dx-platform/issues/119)) ([c23a8ae](https://github.com/devex-web-frontend/dx-platform/commit/c23a8ae))
* **react-kit:** the ability to disable the min and max buttons separately ([#116](https://github.com/devex-web-frontend/dx-platform/issues/116)) ([dbf39b7](https://github.com/devex-web-frontend/dx-platform/commit/dbf39b7))





# [0.27.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.26.0...v0.27.0) (2019-03-12)


### Bug Fixes

* **react-kit:** Popover. Correct position of popover in custom container ([#115](https://github.com/devex-web-frontend/dx-platform/issues/115)) ([0756796](https://github.com/devex-web-frontend/dx-platform/commit/0756796))


### Features

* **react-kit:** ability to define custom ui for popup ([#112](https://github.com/devex-web-frontend/dx-platform/issues/112)) ([375cd31](https://github.com/devex-web-frontend/dx-platform/commit/375cd31))


### BREAKING CHANGES

* **react-kit:** added PopupUI to popup props

* feat(react-kit): ability to define custom ui for popup






# [0.26.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.25.0...v0.26.0) (2019-02-04)


### Features

* **react-kit:** Timeinput. Added choosing optional seconds and day type. // PR review. Comments applied ([2e5c16d](https://github.com/devex-web-frontend/dx-platform/commit/2e5c16d))
* **react-kit:** Timeinput. Added choosing optional seconds and day type. // PR review. Rewrite with Options ([b231d43](https://github.com/devex-web-frontend/dx-platform/commit/b231d43))
* **react-kit:** Timeinput. Added choosing optional seconds and day type. // PR review. Rewrite with Options V2 ([3730550](https://github.com/devex-web-frontend/dx-platform/commit/3730550))
* **react-kit:** Timeinput. Added choosing optional seconds and day type. // PR review. Rewrite with Options V3. Comments implemented ([75900c2](https://github.com/devex-web-frontend/dx-platform/commit/75900c2))
* **react-kit:** Timeinput. Added choosing optional seconds and day type. // PR review. Rewrite with Options V4. Comments implemented ([5c24a32](https://github.com/devex-web-frontend/dx-platform/commit/5c24a32))
* **react-kit:** Timeinput. Added choosing optional seconds and day type. // PR review. Rewrite with Options V5. Comments implemented ([3683284](https://github.com/devex-web-frontend/dx-platform/commit/3683284))
* **react-kit:** Timeinput. Added choosing optional seconds and day type. // PR review. Rewrite with Options V6. Comments implemented ([762db6d](https://github.com/devex-web-frontend/dx-platform/commit/762db6d))
* **react-kit:** Timeinput. Added choosing optional seconds and day type. // PR review. Time fields are taken out to constants ([922e2c5](https://github.com/devex-web-frontend/dx-platform/commit/922e2c5))






# [0.25.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.24.0...v0.25.0) (2019-01-23)

**Note:** Version bump only for package @devexperts/react-kit





# [0.24.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.6...v0.24.0) (2019-01-21)

**Note:** Version bump only for package @devexperts/react-kit





## [0.23.6](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.3...v0.23.6) (2019-01-18)

**Note:** Version bump only for package @devexperts/react-kit





## [0.23.4](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.3...v0.23.4) (2019-01-18)

**Note:** Version bump only for package @devexperts/react-kit






<a name="0.23.3"></a>
## [0.23.3](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.2...v0.23.3) (2019-01-17)




**Note:** Version bump only for package @devexperts/react-kit

<a name="0.23.2"></a>
## [0.23.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.23.1...v0.23.2) (2019-01-17)




**Note:** Version bump only for package @devexperts/react-kit

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




**Note:** Version bump only for package @devexperts/react-kit

<a name="0.21.0"></a>
# [0.21.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.20.0...v0.21.0) (2018-11-26)




**Note:** Version bump only for package @devexperts/react-kit

<a name="0.20.0"></a>
# [0.20.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.19.2...v0.20.0) (2018-11-26)


### Features

* **react-kit:** Date input add inner ref ([#91](https://github.com/devex-web-frontend/dx-platform/issues/91)) ([8ac4e80](https://github.com/devex-web-frontend/dx-platform/commit/8ac4e80))


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




**Note:** Version bump only for package @devexperts/react-kit

<a name="0.17.0"></a>
# [0.17.0](https://github.com/devex-web-frontend/dx-platform/compare/v0.16.2...v0.17.0) (2018-09-25)


### Bug Fixes

* **react-kit:** detect if scrolled node contains popover anchor ([#74](https://github.com/devex-web-frontend/dx-platform/issues/74)) ([78bb8b0](https://github.com/devex-web-frontend/dx-platform/commit/78bb8b0))


### Features

* **react-kit:** fix stateful types ([ed0bc96](https://github.com/devex-web-frontend/dx-platform/commit/ed0bc96))


### BREAKING CHANGES

* **react-kit:** stateful components now require explicit defaultValue, TControlProps now requires strict value/onValueChange




<a name="0.16.2"></a>
## [0.16.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.16.1...v0.16.2) (2018-09-20)


### Bug Fixes

* **react-kit:** fix popover closing on scroll inside ([#67](https://github.com/devex-web-frontend/dx-platform/issues/67)) ([b4416d7](https://github.com/devex-web-frontend/dx-platform/commit/b4416d7)), closes [#66](https://github.com/devex-web-frontend/dx-platform/issues/66)




<a name="0.16.1"></a>
## [0.16.1](https://github.com/devex-web-frontend/dx-platform/compare/v0.16.0...v0.16.1) (2018-09-19)




**Note:** Version bump only for package @devexperts/react-kit

<a name="0.13.3"></a>
## [0.13.3](https://github.com/devex-web-frontend/dx-platform/compare/v0.13.2...v0.13.3) (2018-07-17)




**Note:** Version bump only for package @devexperts/react-kit

<a name="0.13.2"></a>
## [0.13.2](https://github.com/devex-web-frontend/dx-platform/compare/v0.13.1...v0.13.2) (2018-07-17)




**Note:** Version bump only for package @devexperts/react-kit
