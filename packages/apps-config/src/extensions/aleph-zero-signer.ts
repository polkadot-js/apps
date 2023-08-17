// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Known } from './types.js';

import { extensionsAlephZeroSignerSVG } from '../ui/logos/extensions/index.js';

export const AlephZeroSigner = {
  all: {
    chrome: 'https://chrome.google.com/webstore/detail/aleph-zero-signer/opbinaebpmphpefcimknblieddamhmol',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/aleph-zero-signer/'
  },
  desc: 'The easiest way to get into using Aleph Zero',
  name: 'The Aleph Zero Signer',
  ui: {
    logo: extensionsAlephZeroSignerSVG
  }
} satisfies Known;
