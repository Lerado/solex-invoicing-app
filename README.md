# Introduction 
**SolexInvoicing** is a desktop and web client in charge of Solex invoicing service.

Please, carefully read ``CONTRIBUTING.md`` before contributing to this project.

# Getting Started
This project is build using [Angular](https://angular.io) and [Angular Material](https://material.angular.io) as primary UI components library and [Tauri](https://tauri.app/) for Desktop cross-platform builds. We use semantic versioning but **DO NOT** follow Angular versioning system.
## 1.	Installation process
- Clone this repository and move to the result directory **SolexInvoicing**

- Get [node v18-lts or later](https://nodejs.org/). We recommend the latest stable version.

- Install [yarn](https://yarnpkg.com) as a global dependency
  
  `npm install -g yarn`

- Pull dependencies
  
  `yarn install`

- Serve using Angular CLI and access via https://localhost:4200

  `ng serve`

- Serve as desktop client (needs to setup tauri first as described [here](https://tauri.app/v1/guides/getting-started/prerequisites))

  `npm run tauri dev`
## 2.	Software dependencies
- [Node v18 or later](https://nodejs.org/) LTS recommended
- [Yarn](https://yarnpkg.com) (optional but highly recommended)
- [Docker LTS](https://docker.com) (optional)
- [Tauri v2 or later](https://tauri.app/)
## 3.	Latest releases
See ``CHANGELOG.md`` to consult changes history and updates.

# Build and Test
Make sure to complete the installation steps before doing this:
## 1.	Build process
- Build using Angular CLI

  `ng build`

- Build using Tauri (Windows, Mac, Linux) [here](https://tauri.app/v1/guides/building/)
## 2.	Testing process
- Run unitary tests
  
  `ng test`

- Run all test (unitary, spell, lint, e2e)
  
  `npm run test`
# Contribute
We follow [Git-flow model](https://git-flow.readthedocs.io/) for development, versioning and contributions. Please, carefully read ``CONTRIBUTING.md`` before contributing to this project.

# Technical specs

# API references
- [Fuse admin template docs](https://angular-material.fusetheme.com/docs/guides/getting-started/introduction)
