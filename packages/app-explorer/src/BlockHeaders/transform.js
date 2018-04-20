// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Header } from '@polkadot/primitives/header';
import type { BlockHeaders } from '../types';

import encodeHeader from '@polkadot/primitives-codec/header/encode';
import blake2Asu8a256 from '@polkadot/util-crypto/blake2/asU8a256';
import { blockHeaders } from '../subjects';

export default function transform (header: Header): BlockHeaders {
  const prev = blockHeaders.getValue();

  if (!header) {
    return prev;
  }

  const encoded = encodeHeader(header);
  const hash = blake2Asu8a256(encoded);

  return prev.reduce((next, value, index) => {
    if (index < 9) {
      next.push(value);
    }

    return next;
  }, [{ hash, header }]);
}
