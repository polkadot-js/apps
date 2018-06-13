// Copyright 2016 Dan Finlay
// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

const randomAsU8a = require('@polkadot/util-crypto/random/asU8a');

const identicon = require('./index');

const element = document.getElementById('demo');

if (!element) {
  throw new Error('Unable to find #demo element');
}

function generateIcon (seed: Uint8Array = randomAsU8a(32)): void {
  const start = Date.now();

  element.append(
    identicon(seed, 100, 'padded')
  );

  console.log(`Icon generated in ${(Date.now() - start)}ms`);
}

function generateIcons (count: number = 512): void {
  generateIcon(new Uint8Array(32));

  for (let index = 1; index < count; index++) {
    generateIcon();
  }
}

generateIcons();
