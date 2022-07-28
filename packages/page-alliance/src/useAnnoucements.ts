// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletAllianceCid } from '@polkadot/types/lookup';
import type { Announcement } from './types';

import { CID } from 'multiformats/cid';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { u8aToBn } from '@polkadot/util';

function createIpfs (cid: PalletAllianceCid): string {
  try {
    const { codec, hash_: { code, digest }, version } = cid;

    return CID
      .create(version.index as 0, codec.toNumber(), {
        bytes: digest.subarray(4),
        code: code.toNumber(),
        digest: digest.toU8a(true),
        size: u8aToBn(digest.subarray(0, 4)).toNumber()
      })
      .toString();
  } catch (error) {
    console.error(`createIpfs: ${(error as Error).message}::`, cid.toHuman());

    return '';
  }
}

const OPT_ANN = {
  transform: (cids: PalletAllianceCid[]): Announcement[] =>
    cids.map((cid) => ({
      cid,
      ipfs: createIpfs(cid),
      key: cid.toHex()
    }))
};

function useAnnouncementsImpl (): Announcement[] | undefined {
  const { api } = useApi();

  return useCall<Announcement[]>(api.query.alliance.announcements, [], OPT_ANN);
}

export default createNamedHook('useAnnouncements', useAnnouncementsImpl);
