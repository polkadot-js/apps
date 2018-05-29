[![polkadotjs](https://img.shields.io/badge/polkadot-js-orange.svg?style=flat-square)](https://polkadot.js.org)
![isc](https://img.shields.io/badge/license-ISC-lightgrey.svg?style=flat-square)
[![style](https://img.shields.io/badge/code%20style-semistandard-lightgrey.svg?style=flat-square)](https://github.com/Flet/semistandard)
[![npm](https://img.shields.io/npm/v/@polkadot/ui-react-rx.svg?style=flat-square)](https://www.npmjs.com/package/@polkadot/ui-react-rx)
[![travis](https://img.shields.io/travis/polkadot-js/apps.svg?style=flat-square)](https://travis-ci.org/polkadot-js/ui)
[![maintainability](https://img.shields.io/codeclimate/maintainability/polkadot-js/apps.svg?style=flat-square)](https://codeclimate.com/github/polkadot-js/apps/maintainability)
[![coverage](https://img.shields.io/coveralls/polkadot-js/apps.svg?style=flat-square)](https://coveralls.io/github/polkadot-js/apps?branch=master)
[![dependency](https://david-dm.org/polkadot-js/apps.svg?style=flat-square&path=packages/ui-react-rx)](https://david-dm.org/polkadot-js/apps?path=packages/ui-react-rx)
[![devDependency](https://david-dm.org/polkadot-js/apps/dev-status.svg?style=flat-square&path=packages/ui-react-rx)](https://david-dm.org/polkadot-js/apps?path=packages/ui-react-rx#info=devDependencies)

# @polkadot/ui-react-rx

A collection of RxJS enabled React components that operate with the [@polkadot/api-rx](https://github.com/polkadot-js/api) library. It automatically manages subscriptions on behalf of the developer, providing a number of unstyled components that can be used to construct UIs.

## usage

Basic usage entails creating a `ContextProvider` and just using the components. For instance, to display the current node time,

```js
import React from 'react';
import ReactDOM from 'react-dom';

import { Api, NodeTime } from '@polkadot/ui-react-rx';

...
ReactDOM.render(
  <Api>
    <NodeTime />
  </Api>,
  document.querySelector('#container')
);
...
```

All components are provided unstyled making no assumptions on the actual use, however they all support (optionally) the `label`, `className` and `style` attributes, that can be used to style to component.

```js
...
ReactDOM.render(
  <Api>
    <NodeTime className='rx-time' label='current node time:' />
  </Api>,
  document.querySelector('#container')
);
...
```
