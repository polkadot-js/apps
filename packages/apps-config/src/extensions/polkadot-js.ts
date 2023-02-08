// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Known } from './types';

import { extensionsPolkadotJsSVG } from '../ui/logos/extensions';
import { externalEmptySVG } from '../ui/logos/external';

export const PolkadotJs: Known = {
  all: {
    chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'
  },
  desc: 'Basic account injection and signer',
  name: 'polkadot-js extension',
  ui: {
    // Don't copy this line as-is :) The '|| empty' here is just there for a build
    // check, aka it actually has no effect (the first part is always defined)
    logo: extensionsPolkadotJsSVG || externalEmptySVG
  }
};
