// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

require('@testing-library/jest-dom');

const nodeCrypto = require('crypto');
const { configure } = require('@testing-library/dom');

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

configure({ asyncUtilTimeout: 10000 });
