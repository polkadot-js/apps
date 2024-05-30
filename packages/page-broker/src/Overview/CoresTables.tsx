// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreWorkloadInfo, CoreWorkplanInfo } from '@polkadot/react-hooks/types';
import type { PalletBrokerStatusRecord } from '@polkadot/types/lookup';

import React from 'react';

import { useCall } from '@polkadot/react-hooks';

import CoreTable from './CoreTable.js';

interface Props {
  api?: ApiPromise;
  workloadInfos?: CoreWorkloadInfo[] | CoreWorkloadInfo;
  workplanInfos?: CoreWorkplanInfo[] | CoreWorkplanInfo;
}

function CoresTable ({ api, workloadInfos, workplanInfos }: Props): React.ReactElement<Props> {
  const query = useCall<PalletBrokerStatusRecord>(api?.query.broker?.status);
  const cores = query ? query.toJSON().coreCount : 0;

  console.log('core', cores);
  const coreArr = [];

  for (let core = 0; core < Number(cores); core++) {
    console.log('core', core);
    coreArr.push(core);
  }

  let sanitizedWorkloadInfos: CoreWorkloadInfo[] = [];
  let sanitizedWorkplanInfos: CoreWorkplanInfo[] = [];

  if (Array.isArray(workloadInfos)) {
    sanitizedWorkloadInfos = workloadInfos;
  } else if (workloadInfos) {
    sanitizedWorkloadInfos.push(workloadInfos);
  }

  if (Array.isArray(workplanInfos)) {
    sanitizedWorkplanInfos = workplanInfos;
  } else if (workplanInfos) {
    sanitizedWorkplanInfos.push(workplanInfos);
  }

  sanitizedWorkloadInfos?.sort((a, b) => a.core - b.core);
  sanitizedWorkplanInfos?.sort((a, b) => a.core - b.core);

  const list: [number, CoreWorkloadInfo[], CoreWorkplanInfo[]][] = [];

  coreArr.forEach((c) => {
    list.push([c, sanitizedWorkloadInfos.filter((v) => v.core === c), sanitizedWorkplanInfos.filter((v) => v.core === c)]);
  });

  return (
    <>
      {
        list.map((c) =>
          (
            <CoreTable
              core={c[0]}
              key={c[0]}
              workload={c[1]}
              workplan={c[2]}
            />
          )
        )
      }
    </>
  );
}

export default React.memo(CoresTable);
