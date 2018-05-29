[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange.svg?style=flat-square)](https://polkadot.js.org)
![isc](https://img.shields.io/badge/license-ISC-lightgrey.svg?style=flat-square)
[![style](https://img.shields.io/badge/code%20style-semistandard-lightgrey.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![npm](https://img.shields.io/npm/v/@polkadot/ui-identicon.svg?style=flat-square)](https://www.npmjs.com/package/@polkadot/ui-identicon)
[![travis](https://img.shields.io/travis/polkadot-js/apps.svg?style=flat-square)](https://travis-ci.org/polkadot-js/ui)
[![maintainability](https://img.shields.io/codeclimate/maintainability/polkadot-js/apps.svg?style=flat-square)](https://codeclimate.com/github/polkadot-js/apps/maintainability)
[![coverage](https://img.shields.io/coveralls/polkadot-js/apps.svg?style=flat-square)](https://coveralls.io/github/polkadot-js/apps?branch=master)
[![dependency](https://david-dm.org/polkadot-js/apps.svg?style=flat-square&path=packages/ui-identicon)](https://david-dm.org/polkadot-js/apps?path=packages/ui-identicon)
[![devDependency](https://david-dm.org/polkadot-js/apps/dev-status.svg?style=flat-square&path=packages/ui-identicon)](https://david-dm.org/polkadot-js/apps?path=packages/ui-identicon#info=devDependencies)

# @polkadot/ui-identicon

Adapted from [Jazzicon](https://github.com/danfinlay/jazzicon) by Dan Finlay with the following changes -

- Random values now is read from the Uint8Array supplied (as opposed to having the seed as a number). This allows us to give an publicKey/address as an input and use those values in the pattern generation.
- Upgrade to the underlying [color](https://github.com/Qix-/color) library
- Generate circles as shapes (instead of rectangles)
- Interface updated to take in optional className & style
- Update everywhere to use ES6
- Split source into self-contained functions (TODO: future testing)
- Everything has been updated to use flow
- Test the library functions
- Copyright headers added (original also under ISC)

## Usage

```js
import identicon from '@polkadot/ui-identicon';

const publicKey = new Uint8Array([...]); // 32 bytes
const body = document.querySelector('body');
const identity = identicon(publicKey, 100 /* diameter, optional */, 'my-class' /* className, optional */ /* style. optional */ /* colors, optional */);

body.append(identity);
```

Also see [src/demo.js](src/demo.js) for a randomly generated example.

![demo](https://raw.githubusercontent.com/polkadot-js/ui/master/packages/ui-identicon/demo.png)
