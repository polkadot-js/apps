// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Option, StorageKey, u16, u32, Vec } from '@polkadot/types';
import type { PalletBrokerScheduleItem } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { CoreWorkplan } from './types.js';

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

function extractInfo (info: Vec<PalletBrokerScheduleItem>, core: number, timeslice: number): CoreWorkplan {
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
    },
    timeslice
  };
}

const OPT_KEY = {
  transform: (keys: StorageKey<[u32, u16]>[]): [u32, u16][] =>
    keys.map(({ args: [timeslice, core] }) => [timeslice, core])
};

function useWorkplanInfosImpl (api: ApiPromise, ready: boolean): CoreWorkplan[] | undefined {
  const workplanKeys = useMapKeys(ready && api?.query.broker.workplan, [], OPT_KEY);

  const sanitizedKeys = workplanKeys?.map((value) => {
    return value[0];
  });

  const workplanInfo = useCall<[[[u32, u16][]], Option<Vec<PalletBrokerScheduleItem>>[]]>(ready && api?.query.broker.workplan.multi, [sanitizedKeys], { withParams: true });

  const [state, setState] = useState<CoreWorkplan[] | undefined>();

  useEffect(() => {
    if (!workplanInfo?.[1] || !workplanInfo[0]?.[0]) {
      return;
    }

    const coreInfo = workplanInfo[0][0];

    setState(
      sortByCore(coreInfo.map((core: BN[], index) =>
        extractInfo(workplanInfo[1][index].unwrap(), core[1].toNumber(), core[0].toNumber())
      ))
    );
  }, [workplanInfo]);

  return state;
}

export const useWorkplanInfos = createNamedHook('useWorkplanInfos', useWorkplanInfosImpl);
