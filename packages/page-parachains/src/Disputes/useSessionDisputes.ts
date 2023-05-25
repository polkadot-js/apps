// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option, StorageKey, u32 } from '@polkadot/types';
import type { PolkadotPrimitivesV4DisputeState } from '@polkadot/types/lookup';
import type { Codec } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';
import type { DisputeInfo, SessionInfo } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import useSessionInfo from './useSessionInfo.js';

function queryDisputes (api: ApiPromise, sessionInfo: SessionInfo): Promise<DisputeInfo> {
  return Promise
    .all(
      sessionInfo.sessionIndexes.map((index) =>
        api.query.parasDisputes.disputes.entries(index) as unknown as Promise<[StorageKey<[u32, Codec]>, Option<PolkadotPrimitivesV4DisputeState>][]>
      )
    )
    .then((entries) => ({
      disputes: entries.reduce<Record<string, Record<HexString, string[]>>>((all, list) => {
        list
          .map(([{ args: [session, id] }, optInfo]): [string, HexString, PolkadotPrimitivesV4DisputeState | null] => [formatNumber(session), id.toHex(), optInfo.unwrapOr(null)])
          .filter((d): d is [string, HexString, PolkadotPrimitivesV4DisputeState] => !!d[2])
          .map(([s, k, d]): [string, HexString, boolean[]] => [s, k, d.validatorsAgainst.toBoolArray()])
          .forEach(([s, k, v]) => {
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
          });

        return all;
      }, {}),
      sessionInfo
    }));
}

function useSessionDisputesImpl (): DisputeInfo | undefined {
  const { api } = useApi();
  const [state, setState] = useState<DisputeInfo | undefined>();
  const sessionInfo = useSessionInfo();

  useEffect((): void => {
    if (sessionInfo) {
      if (sessionInfo.sessionIndexes) {
        queryDisputes(api, sessionInfo)
          .then(setState)
          .catch(console.error);
      } else {
        setState({ sessionInfo });
      }
    }
  }, [api, sessionInfo]);

  return state;
}

export default createNamedHook('useSessionDisputes', useSessionDisputesImpl);
