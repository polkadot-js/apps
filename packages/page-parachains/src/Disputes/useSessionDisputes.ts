// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option, StorageKey, u32 } from '@polkadot/types';
import type { Hash } from '@polkadot/types/interfaces';
import type { PolkadotPrimitivesV4DisputeState } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { DisputeInfo, SessionInfo } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import useSessionInfo from './useSessionInfo.js';

function queryDisputes (api: ApiPromise, sessionInfo: SessionInfo): Promise<DisputeInfo> {
  return Promise
    .all(
      // FIXME We would need to pull the list of validators alongside
      // sessionInfo.sessionIndexes.map((index) =>
      [sessionInfo.sessionCurrentIndex].map((index) =>
        api.query.parasDisputes.disputes.entries(index) as unknown as Promise<[StorageKey<[u32, Hash]>, Option<PolkadotPrimitivesV4DisputeState>][]>
      )
    )
    .then((entries) =>
      // TODO Here we wish to extract the actual sessionValidators as well
      entries.map((list) =>
        list.map(([{ args: [session, id] }, optInfo]): [BN, Hash, boolean[]] => [session, id, optInfo.isSome ? optInfo.unwrap().validatorsAgainst.toBoolArray() : []])
      )
    )
    .then((entries) => ({
      disputes: entries.reduce<Record<string, Record<HexString, string[]>>>((all, list) =>
        list.reduce((all, [sessionIndex, hash, flags]) => {
          const s = formatNumber(sessionIndex);

          if (!all[s]) {
            all[s] = {};
          }

          all[s][hash.toHex()] = flags.reduce<string[]>((vals, flag, index) => {
            if (flag) {
              vals.push(sessionInfo.paraValidators[index]);
            }

            return vals;
          }, []);

          return all;
        }, all), {}),
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
