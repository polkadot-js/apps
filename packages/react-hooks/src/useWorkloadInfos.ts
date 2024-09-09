// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { StorageKey, u32, Vec } from '@polkadot/types';
import type { PalletBrokerScheduleItem } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import { useEffect, useState } from 'react';
import { createNamedHook, useCall, useMapKeys } from '@polkadot/react-hooks';
import { processHexMask } from './utils/dataProcessing.js';
import { CoreWorkload } from './types.js';

function extractInfo (info: PalletBrokerScheduleItem[], core: number): CoreWorkload {
  const mask: string[] = processHexMask(info[0]?.mask);
  const assignment = info[0].assignment
  return {
    core,
    info: {
      mask,
      maskBits: mask.length,
      task: assignment.isTask ? assignment.asTask.toString() : assignment.isPool ? 'Pool' : '',
      isTask: assignment.isTask,
      isPool: assignment.isPool
    }
  }
}

const OPT_KEY = {
  transform: (keys: StorageKey<[u32]>[]): u32[] =>
    keys.map(({ args: [core] }) => core)
};

function useWorkloadInfosImpl(api: ApiPromise, ready: boolean): CoreWorkload[] | undefined {
  const cores = useMapKeys(ready && api.query.broker.workload, [], OPT_KEY);
  const workloadInfo = useCall<[[BN[]], Vec<PalletBrokerScheduleItem>[]]>(ready && api.query.broker.workload.multi, [cores], { withParams: true });
  const [state, setState] = useState<CoreWorkload[] | undefined>();

  useEffect((): void => {
    if (!workloadInfo || !workloadInfo[0] || !workloadInfo[0][0]) return;
    const cores = workloadInfo[0][0];
    
    setState(
      cores.map((core, index) => extractInfo( workloadInfo[1][index], core.toNumber()))
    )
  }, [workloadInfo]);
  return state;
}

export const useWorkloadInfos = createNamedHook('useWorkloadInfos', useWorkloadInfosImpl);
