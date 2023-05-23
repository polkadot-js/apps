// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey } from '@polkadot/types';
import type { PolkadotPrimitivesV4DisputeState } from '@polkadot/types/lookup';
import type { Codec } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';
import type { DisputeInfo, SessionInfo } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useMapEntries } from '@polkadot/react-hooks';

import useSessionInfo from './useSessionInfo.js';

const OPT_ENTRIES = {
  transform: (entries: [StorageKey<[Codec, Codec]>, Option<PolkadotPrimitivesV4DisputeState>][]): [HexString, boolean[]][] =>
    entries
      .map(([{ args: [, id] }, optInfo]): [HexString, PolkadotPrimitivesV4DisputeState | null] => [id.toHex(), optInfo.unwrapOr(null)])
      .filter((d): d is [HexString, PolkadotPrimitivesV4DisputeState] => !!d[1])
      .map(([k, d]) => [k, d.validatorsAgainst.toBoolArray()])
};

function extractDisputes (sessionInfo?: SessionInfo, disputes?: [HexString, boolean[]][]): DisputeInfo | undefined {
  if (!sessionInfo) {
    return undefined;
  } else if (!disputes) {
    return { sessionInfo };
  }

  console.log(disputes);

  return {
    disputes: disputes.reduce<Record<HexString, string[]>>((all, [k, v]) => {
      all[k] = v
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
  const disputedBv = useMapEntries(session && api.query.parasDisputes?.disputes, [session?.sessionIndex], OPT_ENTRIES);

  return useMemo(
    () => extractDisputes(session, disputedBv),
    [disputedBv, session]
  );
}

export default createNamedHook('useSessionDisputes', useSessionDisputesImpl);
