// Copyright 2017-2024 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey, u16 } from '@polkadot/types';
import type { PalletBrokerScheduleItem } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { CoreWorkloadInfo } from './types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall, useMapKeys } from '@polkadot/react-hooks';

function extractInfo (info: PalletBrokerScheduleItem[], core: number): CoreWorkloadInfo {

  return {
    core,
    info
  };
}

const OPT_KEY = {
  transform: (keys: StorageKey<[u16]>[]): u16[] =>
    keys.map(({ args: [core] }) => core)
};

function useWorkloadInfosImpl (): CoreWorkloadInfo[] | undefined {
  const { api } = useApi();
  const cores = useMapKeys(api.query.broker.workload, [], OPT_KEY);
  const workloadInfo = useCall<[[BN[]], PalletBrokerScheduleItem[]]>(api.query.broker.workload.multi, [cores], { withParams: true });
  const [state, setState] = useState<CoreWorkloadInfo[] | undefined>();

  useEffect((): void => {
    workloadInfo &&
      setState(
        workloadInfo[0][0].map((info, index) =>
          extractInfo(workloadInfo[1][index] as unknown as PalletBrokerScheduleItem[], info.toNumber())
        )
      );
  }, [workloadInfo]);

  return state;
}

export default createNamedHook('useWorkloadInfos', useWorkloadInfosImpl);
