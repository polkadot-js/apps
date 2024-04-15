// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey, u32, Vec } from '@polkadot/types';
import type { PalletBrokerScheduleItem } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { CoreWorkloadInfo } from '../../page-coretime/src/types.js';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall, useMapKeys } from '@polkadot/react-hooks';

function extractInfo (info: PalletBrokerScheduleItem[], core: number): CoreWorkloadInfo {
  return {
    core,
    info
  };
}

const OPT_KEY = {
  transform: (keys: StorageKey<[u32]>[]): u32[] =>
    keys.map(({ args: [core] }) => core)
};

function useWorkloadInfosImpl (): CoreWorkloadInfo[] | undefined {
  const { api } = useApi();
  const cores = useMapKeys(api.query.broker.workload, [], OPT_KEY);
  const workloadInfo = useCall<[[BN[]], Vec<PalletBrokerScheduleItem>[]]>(api.query.broker.workload.multi, [cores], { withParams: true });
  const [state, setState] = useState<CoreWorkloadInfo[] | undefined>();

  useEffect((): void => {
    workloadInfo &&
      setState(
        workloadInfo[0][0].map((info, index) =>
          extractInfo(workloadInfo[1][index], info.toNumber())

        )
      );
  }, [workloadInfo]);

  return state;
}

export default createNamedHook('useWorkloadInfos', useWorkloadInfosImpl);
