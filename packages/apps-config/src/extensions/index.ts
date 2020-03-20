// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// it would have been really good to import this from detect, however... not exported
type Browser = 'chrome' | 'firefox';

interface Extension {
  desc: string;
  link: string;
  name: string;
}

const availableExtensions: Record<Browser, Extension[]> = [
  {
    browsers: {
      chrome: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'
    },
    desc: 'Basic account injection and signer',
    name: 'polkadot-js extension'
  }
].reduce((available: Record<Browser, Extension[]>, { browsers, desc, name }): Record<Browser, Extension[]> => {
  Object.entries(browsers).forEach(([browser, link]): void => {
    available[browser as 'chrome'].push({ link, desc, name });
  });

  return available;
}, { chrome: [], firefox: [] });

export { availableExtensions };
