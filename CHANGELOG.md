# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
