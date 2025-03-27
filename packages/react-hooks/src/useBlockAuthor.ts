// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { U32 } from '@polkadot/types-codec';

import { useCallback, useEffect, useState } from 'react';

import { useApi } from './useApi.js';

type AuxData = [AccountId32[], U32];

export function useBlockAuthor (header: HeaderExtended | undefined) {
  const [author, setAuthor] = useState<AccountId32 | undefined>(undefined);
  const { api } = useApi();

  const slot = header?.digest.logs.map((log) => {
    if (log.isPreRuntime) {
      const [_, data] = log.asPreRuntime;

      return api.createType('U64', data.toU8a());
    }

    return null;
  }).filter(Boolean);

  const extractAuthor = async (): Promise<AccountId32> => {
    const [authorities, sessionLength]: AuxData = await api.call.spinApi.auxData();
    const sessionIdx = Math.floor(slot?.[0] as any / sessionLength.toNumber());
    const authorIdx = sessionIdx % authorities.length;

    return authorities[authorIdx];
  };

  const extractAuthorCb = useCallback(extractAuthor, [slot, api.call.spinApi]);

  useEffect(() => {
    extractAuthorCb()
      .then((a) => setAuthor(a))
      .catch((e) => console.error(e));
  }, [extractAuthorCb, api.call.spinApi]);

  return author;
}
