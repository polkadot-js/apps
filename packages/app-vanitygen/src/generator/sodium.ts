// Copyright 2017-2018 @polkadot/app-vanitygen authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Generator$PkFromSeed } from './types';

import sodiumKeygen from './sodiumKeygen';

let pkFromSeed: Generator$PkFromSeed | undefined;

try {
  const sodium = require('sodium');

  pkFromSeed = sodiumKeygen(sodium.api);
} catch (error) {
  console.log(`Using NaCl bindings from 'tweet-nacl' (faster 'sodium' dependency not installed)`);
}

export {
  pkFromSeed
};
