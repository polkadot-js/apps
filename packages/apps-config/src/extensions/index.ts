// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { detect } from 'detect-browser';

import { InjectedWindow } from '@polkadot/extension-inject/types';

// it would have been really good to import this from detect-browser, however... not exported
type Browser = 'chrome' | 'firefox';

interface Extension {
  desc: string;
  link: string;
  name: string;
}

export interface Browsers {
  chrome: string;
  firefox: string;
}

export interface RawExtension {
  browsers: Browsers;
  desc: string;
  name: string;
}

export interface PreppedExtension extends RawExtension {
  isInstalled: boolean;
}

export const extensionList: RawExtension[] = [
  {
    browsers: {
      chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'
    },
    desc: 'Basic account injection and signer',
    name: 'polkadot-js'
  },
  {
    browsers: {
      chrome: 'https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/'
    },
    desc: 'Talisman is a Polkadot wallet that unlocks a new world of multichain web3 applications in the Paraverse',
    name: 'talisman'
  }
];

// The list of known extensions including the links to them on the store. This is used when
// no extensions are actually available, promoting the user to install one or more

export const availableExtensions: Record<Browser, Extension[]> = extensionList.reduce((available: Record<Browser, Extension[]>, { browsers, desc, name }): Record<Browser, Extension[]> => {
  Object.entries(browsers).forEach(([browser, link]): void => {
    available[browser as 'chrome'].push({ desc, link, name });
  });

  return available;
}, { chrome: [], firefox: [] });

export const supportedExtensionsNames = () => extensionList.map(({ name }) => name);

export const getUserInstalledExtensions = () => {
  const injectedWindow = window as Window & InjectedWindow;
  const userExtensions = Object.keys(injectedWindow.injectedWeb3);

  return { injectedWeb3: injectedWindow.injectedWeb3, userExtensions };
};

export const getExtensionLink = (browsers: Browsers): string => {
  const browser = detect();

  if (browser !== null && Object.keys(browsers).includes(browser.name)) {
    return browsers[browser.name as Browser];
  }

  return browsers.chrome;
};
