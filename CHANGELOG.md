# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.5](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/compare/v0.2.3...v0.2.5) (2025-07-24)


### Bug Fixes

* **modern-layout:** reduce footer height ([330e170](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/330e17042f146a68fd9a5afaaf0ded3b543f9e27))

### [0.2.4](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/compare/v0.2.3...v0.2.4) (2025-07-24)


### Bug Fixes

* **modern-layout:** reduce footer height ([330e170](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/330e17042f146a68fd9a5afaaf0ded3b543f9e27))

### [0.2.3](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/compare/v0.2.2...v0.2.3) (2025-07-24)


### Features

* **updater:** check, download and install app updates at startup ([d253c35](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/d253c35e607561a9d289f8466d713cd5f5a20e97))


### Bug Fixes

* **tauri.conf.json:** typo in updater plugin endpoint ([e703cb5](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/e703cb5e5bfb46b7bf4fad8e41245dd56de13ca1))

### [0.2.2](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/compare/v0.2.1...v0.2.2) (2025-07-23)


### Features

* **shipment:** edit shipment information, sender, recipient and items ([6b93ae6](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/6b93ae670c1f6b751aa16f3e666d7b0ba658f38d))


### Bug Fixes

* **shipping-receipt:** make receipt more printer-friendly after testing with pos printer ([c1bb720](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/c1bb7205f0a91cc96c640e07e093936cd4d74d34))

### [0.2.1](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/compare/v0.2.0...v0.2.1) (2025-07-22)


### Features

* **client:** edit and delete client information ([200bf68](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/200bf68c5272873938a0f56859d066e611b10ea2))
* set product name and window title to a french label ([3091878](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/309187846aced2fd9d1a3552a19505084d05d9aa))
* **shipment:** delete shipment from list ([cd14d7c](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/cd14d7c17dad2422f3bf982fbfb4f946fdb506a4))
* **splashscreen:** add company label on loading truck ([be43624](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/be4362449606630bb41cef684d2efb9cfd804224))


### Bug Fixes

* **clients:** mismatch between firstname and lastname columns headers ([192385f](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/192385fb39e95f9cb1d02ce0652f540586b84fe3))
* hide id column in table lists ([0211103](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/02111035de2e11d6266f331822176a79578ae7c6))
* **layout:** position navbar as fixed ([f3dbd98](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/f3dbd9854c2be2fe8822a2b879300b4dcd4495cc))
* **layout:** use default window decorations for mac/linux compatibility ([619e4da](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/619e4dad35ec417899906d811fac84e8a545520e))
* **print:** allow webview print ([ca1e750](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/ca1e75004facf4563841abda83b8628f6cec009b))
* **printing:** remove unnecessary margins on print ([e7eed5d](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/e7eed5d2d652f4448ac0146d1c7cdd33bbaffa05))
* **shipment-info:** total price input should be initially empty instead of 0 ([f894546](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/f8945465e1077c22f37d528c95c694bd325568b8))
* **shipping-receipt:** format dimensions on receipt ([d31d1fa](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/d31d1faad2bae12f63c394b2287efbf88067f796))
* spacing of icons when used within buttons ([00ef806](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/00ef8064bd3e85422a8efc48be91aa0e6b303cac))
* **splashscreen:** loading window does not show up before main window ([47218d4](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/47218d47d7cd883ea3e2f2c643e035fd489afc97))
* table sorting state must be initialized ([3871a5a](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/3871a5a05c67b54715f18e05b4720c18b16e5641))

## [0.2.0](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/compare/v0.1.0...v0.2.0) (2025-07-20)


### ⚠ BREAKING CHANGES

* **api:** Shipments have a completely new object models and requires a lot of additional
informations. Clients are also introduced and many typescript interfaces related to data objects
were updated, removed, added or deprecated.

### Features

* **client:** add and display clients ([bf4319d](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/bf4319db8c4ad887709be2b15c942ccc6b5ea906))
* **shipment:** match printable slip with db changes from d727a8c and add shipping receipt view ([a85cabb](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/a85cabbfce649c9d37f302a140b2bce23a304048))
* **shipment:** update shipment creation to match database updates made at d727a8c ([31d97b6](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/31d97b6d84ee2d6611e6be84d2994955667a9550))
* **sign-up:** add city and country code fields to cashier sign-up form ([723a4c2](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/723a4c229ec9f1ca0bd470c2878c4012e0663686))
* **user:** add city code to displayed cashier name ([9395b48](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/9395b4805cb787f6de6034944b901e22c7291c4b))


### Bug Fixes

* **lint:** correct linter issues ([65db100](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/65db100047e906cc85c7aaf00a5db1cfa857dfc4))
* **splashscreen:** add missing </body> enclosing tag ([5619cf7](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/5619cf7399c77de3d7b2fc8a7e5acd3ca43d118c))


* **api:** apply new database schema and update data models" ([d727a8c](https://dev.azure.com/mohlahsolutions/Solex/_git/solex-invoicing/commit/d727a8c27f0499639e86da4a9a446559286648d2))

## [0.1.0](https://github.com/Lerado/solex-invoicing-app/compare/v0.0.6...v0.1.0) (2024-03-29)


### Features

* **desktop:** data persistence in filesystem using sqlite ([1f1e318](https://github.com/Lerado/solex-invoicing-app/commit/1f1e3187009f14b4f168ebb3fd9d9cfe65c46444))
* **shipment:** let the user decide to add packages directly after shipment created successfully ([19ce791](https://github.com/Lerado/solex-invoicing-app/commit/19ce791b8656f873dbaa8ae088566a04fd9c791d))
* **shipments:** print shipment receipt ([c26923e](https://github.com/Lerado/solex-invoicing-app/commit/c26923ebf0c900d2ebefec21f72602e6bb166812))


### Bug Fixes

* **packages:** handle and show errors occuring during package creation ([db3af01](https://github.com/Lerado/solex-invoicing-app/commit/db3af01ef627385db563faa6c6e18ef58ce9c070))
* permission missing to access current platform name ([c4036df](https://github.com/Lerado/solex-invoicing-app/commit/c4036dfae5c03ef5b2e39beb84984779bc36f649))
* **shipments:** wrong shipment ticket layout and footer info ([3a8cd27](https://github.com/Lerado/solex-invoicing-app/commit/3a8cd27261db2926727c4e75b6ba7848edbbf827))
* **window:** unable to drag window in empty layout ([7ef65e2](https://github.com/Lerado/solex-invoicing-app/commit/7ef65e2aabb64b9a90340dfad0c42c892a614f01))
* wrong creation dates in tables because we multiply timestamps in ms by 1000 ([02d23a1](https://github.com/Lerado/solex-invoicing-app/commit/02d23a1e9b244578eb44353dad0c40311dce8a6c))

### [0.0.6](https://github.com/Lerado/solex-invoicing-app/compare/v0.0.5...v0.0.6) (2024-03-05)


### Bug Fixes

* **shipments:** correct shipment number format to 1234567AAA ([7ac5ec5](https://github.com/Lerado/solex-invoicing-app/commit/7ac5ec567844402b13285cb024f852093f246fa7))

### [0.0.5](https://github.com/Lerado/solex-invoicing-app/compare/v0.0.4...v0.0.5) (2024-03-05)


### Features

* **auth:** register cashier account during application first bootstrap ([ecbaab5](https://github.com/Lerado/solex-invoicing-app/commit/ecbaab56a5fe08b63a273ffa557480568795e6ed))
* **desktop:** add custom window maximize, minimize and close commands ([addfd42](https://github.com/Lerado/solex-invoicing-app/commit/addfd423a2f5b789cbdab498a33891a48dff22ff))
* **layout:** add active account menu to modern layout ([976bb5b](https://github.com/Lerado/solex-invoicing-app/commit/976bb5b184548b9b1e4b60238416b787e7752748))
* **splashscreen:** add splashscreen to desktop app ([60352f7](https://github.com/Lerado/solex-invoicing-app/commit/60352f7f726b5e9f4002310cdddcee7332ea4461))


### Bug Fixes

* **layout:** window commands missing in empty layout ([f9139ed](https://github.com/Lerado/solex-invoicing-app/commit/f9139edd01a3df682dc80d73d01c6d7de6424155))

### [0.0.4](https://github.com/Lerado/solex-invoicing-app/compare/v0.0.3...v0.0.4) (2024-03-03)


### Features

* **layout:** replace enterprise layout with modern layout ([83f9986](https://github.com/Lerado/solex-invoicing-app/commit/83f99861367720bad4820f575cde7131813f8407))
* **packages:** create a new shipping package ([9a12fc4](https://github.com/Lerado/solex-invoicing-app/commit/9a12fc49542df1bc026e482c8f2e47c0c194962d))
* **packages:** list shipping packages with pagination, sorting and search ([6c42f12](https://github.com/Lerado/solex-invoicing-app/commit/6c42f12059342ee4aa585daaba27c06340bd461f))
* **shipments:** user can create a shipment ([a1f76eb](https://github.com/Lerado/solex-invoicing-app/commit/a1f76ebf3d36402dee70eb8791fa7deac37bf8a2))


### Bug Fixes

* provide default page size options on all tables ([df7bfc0](https://github.com/Lerado/solex-invoicing-app/commit/df7bfc05deb8252dfa38311d7788b4636e6026cb))

### [0.0.3](https://github.com/Lerado/solex-invoicing-app/compare/v0.0.2...v0.0.3) (2024-02-25)


### Features

* **shipments:** preview shipments table list with search, sorting and pagination ([1bd3af0](https://github.com/Lerado/solex-invoicing-app/commit/1bd3af0ed6ec7f01e4c5dc2266d8af3e25302c22))

### [0.0.2](https://github.com/Lerado/solex-invoicing-app/compare/v0.0.1...v0.0.2) (2024-02-23)


### Bug Fixes

* **splashscreen:** avoid color glitch when animation starts ([d0847bd](https://github.com/Lerado/solex-invoicing-app/commit/d0847bdb196edb39edfc48bf12d0ba745de3e4c8))

### 0.0.1 (2024-02-23)


### Features

* **layout:** craft main horizontal layout ([5fbbbea](https://github.com/Lerado/solex-invoicing-app/commit/5fbbbeae7909fee57bcec422f14c051d95a0cf89))
* **layout:** favicon, font and splash screen ([daf5661](https://github.com/Lerado/solex-invoicing-app/commit/daf5661cea7da4d908f7858170cc04c424fed44a))
