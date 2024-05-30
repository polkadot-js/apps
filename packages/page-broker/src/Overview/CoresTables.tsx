// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkloadInfo, CoreWorkplanInfo } from '@polkadot/react-hooks/types';

import React from 'react';

import CoreTable from './CoreTable.js';

interface Props {
  cores?: number;
  workloadInfos?: CoreWorkloadInfo[] | CoreWorkloadInfo;
  workplanInfos?: CoreWorkplanInfo[] | CoreWorkplanInfo;
}

function CoresTable({ cores, workloadInfos, workplanInfos }: Props): React.ReactElement<Props> {

  const coreArr = [];

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

  if (cores === -1) {
    for (let core = 0; core < sanitizedWorkloadInfos?.length; core++) {
      console.log('core', core);
      coreArr.push(core);
    }
  } else if (cores) {
    coreArr.push(cores)
  }


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
