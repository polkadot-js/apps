// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { StorageKey, u32, Vec } from '@polkadot/types';
import type { PalletBrokerScheduleItem } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { CoreWorkload } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useCall, useMapKeys } from '@polkadot/react-hooks';

import { processHexMask } from './utils/dataProcessing.js';

export function sortByCore<T extends { core: number }> (dataArray?: T | T[]): T[] {
  if (!dataArray) {
    return [];
  }

  const sanitized = Array.isArray(dataArray) ? dataArray : [dataArray];

  return sanitized.sort((a, b) => a.core - b.core);
}

function extractInfo (info: PalletBrokerScheduleItem[], core: number): CoreWorkload {
  const mask: string[] = processHexMask(info[0]?.mask);
  const assignment = info[0].assignment;

  return {
    core,
    info: {
      isPool: assignment.isPool,
      isTask: assignment.isTask,
      mask,
      maskBits: mask.length,
      task: assignment.isTask ? assignment.asTask.toString() : assignment.isPool ? 'Pool' : 'Idle'
    }
  };
}

const OPT_KEY = {
  transform: (keys: StorageKey<[u32]>[]): u32[] =>
    keys.map(({ args: [core] }) => core)
};

function useWorkloadInfosImpl (api: ApiPromise, ready: boolean): CoreWorkload[] | undefined {
  const cores = useMapKeys(ready && api?.query.broker.workload, [], OPT_KEY);
  const workloadInfo = useCall<[[BN[]], Vec<PalletBrokerScheduleItem>[]]>(ready && api?.query.broker.workload.multi, [cores], { withParams: true });
  const [state, setState] = useState<CoreWorkload[] | undefined>();

  useEffect((): void => {
    if (!workloadInfo?.[0]?.[0]) {
      return;
    }

    const cores = workloadInfo[0][0];

    setState(
      sortByCore(cores.map((core, index) => extractInfo(workloadInfo[1][index], core.toNumber())))
    );
  }, [workloadInfo]);

  return state;
}

export const useWorkloadInfos = createNamedHook('useWorkloadInfos', useWorkloadInfosImpl);
