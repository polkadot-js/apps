// Copyright 2016 Dan Finlay
// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import isNull from '@polkadot/util/is/null';
import randomAsU8a from '@polkadot/util-crypto/random/asU8a';

import identicon from './index';

const element = document.getElementById('demo');

function generateIcon (seed: Uint8Array = randomAsU8a(32)): void {
  const start = Date.now();

  if (isNull(element)) {
    throw new Error('Unable to find #demo element');
  }

  element.appendChild(
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
