// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, StorageKey, u16, u32, Vec } from '@polkadot/types';
import type { PalletBrokerScheduleItem } from '@polkadot/types/lookup';
import type { CoreWorkplanInfo } from '../../page-coretime/src/types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall, useMapKeys } from '@polkadot/react-hooks';

function extractInfo (info: Vec<PalletBrokerScheduleItem>, timeslice: number, core: number) {
  return {
    core,
    info,
    timeslice
  };
}

const OPT_KEY = {
  transform: (keys: StorageKey<[u32, u16]>[]): [u32, u16][] =>
    keys.map(({ args: [timeslice, core] }) => [timeslice, core])
};

function useWorkplanInfosImpl (): CoreWorkplanInfo[] | undefined {
  const { api } = useApi();
  const workplanKeys = useMapKeys(api.query.broker.workplan, [], OPT_KEY);

  const sanitizedKeys = workplanKeys?.map((value) => {
    return value[0];
  });

  const workplanInfo = useCall<[[[u32, u16][]], Option<Vec<PalletBrokerScheduleItem>>[]]>(api.query.broker.workplan.multi, [sanitizedKeys], { withParams: true });

  const [state, setState] = useState<CoreWorkplanInfo[] | undefined>();

  useEffect((): void => {
    workplanInfo?.[1] &&
      setState(
        workplanInfo[0][0].map((info, index) =>
          extractInfo(workplanInfo[1][index].unwrap(), info[0].toNumber(), info[1].toNumber())
        )
      );
  }, [workplanInfo]);

  return state;
}

export default createNamedHook('useWorkplanInfos', useWorkplanInfosImpl);
