// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletAllianceCid } from '@polkadot/types/lookup';
import type { ExpandedCid } from './types.js';

import { CID, digest, varint } from 'multiformats';

import { u8aToHex } from '@polkadot/util';

export function fromIpfsCid (cid: string): ExpandedCid | null {
  try {
    const { code: codec, multihash: { code, digest }, version } = CID.parse(cid);

    return {
      codec,
      hash: {
        code,
        digest: u8aToHex(digest)
      },
      version
    };
  } catch (error) {
    console.error(`fromIpfsCid: ${(error as Error).message}::`, cid);

    return null;
  }
}

export function toIpfsCid (cid: PalletAllianceCid): string | null {
  try {
    const { codec, hash_: { code, digest: _bytes }, version } = cid;

    // Since we use parse, encode into a fully-specified bytes to
    // pass - <varint code> + <varint length> + bytes
    const bytes = _bytes.toU8a(true);
    const codeLen = varint.encodingLength(code.toNumber());
    const sizeLen = varint.encodingLength(bytes.length);
    const encoded = new Uint8Array(codeLen + sizeLen + bytes.length);

    varint.encodeTo(code.toNumber(), encoded, 0);
    varint.encodeTo(bytes.length, encoded, codeLen);
    encoded.set(bytes, codeLen + sizeLen);

    return CID
      .create(version.index as 0, codec.toNumber(), digest.decode(encoded))
      .toString();
  } catch (error) {
    console.error(`toIpfsCid: ${(error as Error).message}::`, cid.toHuman());

    return null;
  }
}
