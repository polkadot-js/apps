// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: Move to portal

import type { KeyringPair } from '@polkadot/util-keyring/types';

const assert = require('@polkadot/util/assert');
const u8aConcat = require('@polkadot/util/u8a/concat');

module.exports = function sign (sender?: ?KeyringPair, message: Uint8Array): Uint8Array {
  assert(sender, 'Expected a valid sender to sign');

  return u8aConcat(
    message,
    // $FlowFixMe sender has an actual value
    sender.sign(message)
  );
};
