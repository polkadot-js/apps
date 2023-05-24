// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey, u32 } from '@polkadot/types';
import type { PolkadotPrimitivesV4DisputeState } from '@polkadot/types/lookup';
import type { Codec } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';
import type { DisputeInfo, SessionInfo } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useMapEntries } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import useSessionInfo from './useSessionInfo.js';

const OPT_ENTRIES = {
  transform: (entries: [StorageKey<[u32, Codec]>, Option<PolkadotPrimitivesV4DisputeState>][]): [string, HexString, boolean[]][] =>
    entries
      .map(([{ args: [session, id] }, optInfo]): [string, HexString, PolkadotPrimitivesV4DisputeState | null] => [formatNumber(session), id.toHex(), optInfo.unwrapOr(null)])
      .filter((d): d is [string, HexString, PolkadotPrimitivesV4DisputeState] => !!d[2])
      .map(([s, k, d]) => [s, k, d.validatorsAgainst.toBoolArray()])
};

function extractDisputes (sessionInfo?: SessionInfo, disputes?: [string, HexString, boolean[]][]): DisputeInfo | undefined {
  if (!sessionInfo) {
    return undefined;
  } else if (!disputes) {
    return { sessionInfo };
  }

  return {
    disputes: disputes.reduce<Record<string, Record<HexString, string[]>>>((all, [s, k, v]) => {
      if (!all[s]) {
        all[s] = {};
      }

      all[s][k] = v
        .map((f, index) =>
          f
            ? sessionInfo.paraValidators[index]
            : null
        )
        .filter((v): v is string => !!v);

      return all;
    }, {}),
    sessionInfo
  };
}

function useSessionDisputesImpl (): DisputeInfo | undefined {
  const { api } = useApi();
  const session = useSessionInfo();
  const disputedBv = useMapEntries(session && api.query.parasDisputes?.disputes, [session?.sessionCurrentIndex], OPT_ENTRIES);

  return useMemo(
    () => extractDisputes(session, disputedBv),
    [disputedBv, session]
  );
}

export default createNamedHook('useSessionDisputes', useSessionDisputesImpl);
