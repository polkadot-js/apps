// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Generator$PkFromSeed, Generator$Match, Generator$Options } from './types';

const randomBytes = require('@polkadot/util-crypto/random/asU8a');
const addressEncode = require('@polkadot/util-keyring/address/encode');
const pairFromSeed = require('@polkadot/util-crypto/nacl/keypair/fromSeed');

const calculate = require('./calculate');

const tweetPkFromSeed = (seed: Uint8Array): Uint8Array =>
  pairFromSeed(seed).publicKey;

module.exports = function generator (test: Array<string>, options: Generator$Options, pkFromSeed?: Generator$PkFromSeed = tweetPkFromSeed): Generator$Match {
  const seed = randomBytes();
  const address = addressEncode(pkFromSeed(seed));
  const { count, offset } = calculate(test, address, options);

  return {
    address,
    count,
    offset,
    seed
  };
};
