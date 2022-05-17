// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

require('@testing-library/jest-dom');
require('./substrate-connect');

const nodeCrypto = require('crypto');
const { configure } = require('@testing-library/dom');
const { fetch } = require('@polkadot/x-fetch/node');

CSS = {
  supports () {
    return false;
  }
}

window.crypto = {
  getRandomValues: function (buffer) {
    return nodeCrypto.randomFillSync(buffer);
  }
};

global.fetch = fetch;

configure({ asyncUtilTimeout: 10000 });
