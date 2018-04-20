// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: Move somewhere shared (under primitives?)

import type { Header } from '@polkadot/primitives/header';

import encodeHeader from '@polkadot/primitives-codec/header/encode';
import blake2Asu8a256 from '@polkadot/util-crypto/blake2/asU8a256';

export default function calcHash (header: Header): Uint8Array {
  if (!header) {
    return new Uint8Array([]);
  }

  return blake2Asu8a256(
    encodeHeader(header)
  );
}
