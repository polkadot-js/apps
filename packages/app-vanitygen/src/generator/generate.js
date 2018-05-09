// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Generator$Match, Generator$Options } from './types';

const keypairFromSeed = require('@polkadot/util-crypto/nacl/keypair/fromSeed');
const randomBytes = require('@polkadot/util-crypto/random/asU8a');
const addressEncode = require('@polkadot/util-keyring/address/encode');

const calculate = require('./calculate');

module.exports = function generator (test: Array<string>, options: Generator$Options): Generator$Match {
  const seed = randomBytes();
  const address = addressEncode(
    keypairFromSeed(seed).publicKey
  );
  const { count, offset } = calculate(test, address, options);

  return {
    address,
    count,
    offset,
    seed
  };
};
