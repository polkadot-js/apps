// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreWorkloadInfo, CoreWorkplanInfo } from '@polkadot/react-hooks/types';

import React from 'react';

import { sortByCore } from '../utils.js';
import CoreTable from './CoreTable.js';

interface Props {
  api: ApiPromise;
  cores?: number;
  workloadInfos?: CoreWorkloadInfo[] | CoreWorkloadInfo;
  workplanInfos?: CoreWorkplanInfo[] | CoreWorkplanInfo;
  timeslice: number;
}

interface CoreInfo {
  core: number,
  workload: CoreWorkloadInfo[],
  workplan: CoreWorkplanInfo[]
}

function CoresTable ({ api, cores, timeslice, workloadInfos, workplanInfos }: Props): React.ReactElement<Props> {
  const coreArr = [];
  const sanitizedLoad: CoreWorkloadInfo[] = sortByCore(workloadInfos);
  const sanitizedPlan: CoreWorkplanInfo[] = sortByCore(workplanInfos);

  if (cores === -1 && !!sanitizedLoad) {
    coreArr.push(...sanitizedPlan.map((_, index) => index));
  } else if (cores !== undefined) {
    coreArr.push(cores);
  }

  const filteredList: CoreInfo[] = coreArr.map((c) => ({
    core: c,
    workload: sanitizedLoad.filter((v) => v.core === c),
    workplan: sanitizedPlan.filter((v) => v.core === c)
  }));

  return (
    <>
      {
        filteredList.map((c) => {
          return (
            <CoreTable
              api={api}
              core={c.core}
              key={`core ${c.core}`}
              timeslice={timeslice}
              workload={c.workload}
              workplan={c.workplan}
            />
          );
        }
        )
      }
    </>
  );
}

export default React.memo(CoresTable);
