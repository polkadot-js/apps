// Copyright 2017-2024 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import type { StorageKey, u16, u32, Option } from '@polkadot/types';

import { createNamedHook, useApi, useCall, useMapKeys } from '@polkadot/react-hooks';
import { CoreWorkplanInfo } from './types.js';
import type { PalletBrokerScheduleItem } from '@polkadot/types/lookup';

function extractInfo(info: PalletBrokerScheduleItem[], timeslice: number, core: number) {
  console.log('inf', info)
  return {
    timeslice,
    core,
    info,
  };
}

const OPT_KEY = {
  transform: (keys: StorageKey<[u32, u16]>[]): [u32, u16][] =>
    keys.map(({ args: [timeslice, core] }) => [timeslice, core])
};

function useWorkplanInfosImpl(): CoreWorkplanInfo[] | undefined {
  const { api } = useApi();
  const workplanKeys = useMapKeys(api.query.broker.workplan, [], OPT_KEY);

  const sanitizedKeys = workplanKeys?.map((value) => {
    return value[0];
  })


  const workplanInfo = useCall<[[[u32, u16][]], Option<PalletBrokerScheduleItem>[]]>(api.query.broker.workplan.multi, [sanitizedKeys], { withParams: true });

  const [state, setState] = useState<CoreWorkplanInfo[] | undefined>();
  useEffect((): void => {

    workplanInfo && workplanInfo[1] &&
      setState(
        workplanInfo[0][0].map((info, index) =>
          extractInfo(workplanInfo[1][index].unwrap() as unknown as PalletBrokerScheduleItem[], info[0].toNumber(), info[1].toNumber())
        )
      );
  }, [workplanInfo]);

  return state;
}

export default createNamedHook('useWorkplanInfos', useWorkplanInfosImpl);

