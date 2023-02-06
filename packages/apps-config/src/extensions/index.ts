// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { extensionsPolkadotJsSVG } from '../ui/logos/extensions';

type Browser = 'chrome' | 'firefox';

interface Extension {
  desc: string;
  link: string;
  name: string;
}

interface Known {
  all: Record<Browser, string>;
  desc: string;
  name: string;
  ui: { logo: string; }
}

// The list of known extensions including the links to tem on the store. This is used when
// no extensions are actually available, promoting the user to install one or more
// (Any known extension can and should be added here)

export const knownExtensions: Record<string, Known> = {
  'polkadot-js': {
    all: {
      chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'
    },
    desc: 'Basic account injection and signer',
    name: 'polkadot-js extension',
    ui: {
      logo: extensionsPolkadotJsSVG
    }
  }
};

export const availableExtensions = Object
  .values(knownExtensions)
  .reduce((available: Record<Browser, Extension[]>, { all, desc, name }) => {
    Object.entries(all).forEach(([browser, link]): void => {
      available[browser as Browser].push({ desc, link, name });
    });

    return available;
  }, { chrome: [], firefox: [] });
