// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreInfo, CoreWorkloadType, CoreWorkplanType } from '../types.js';

import React, { useMemo } from 'react';

import CoreTable from './CoreTable.js';

interface Props {
  api: ApiPromise;
  workloadInfos?: CoreWorkloadType[];
  workplanInfos?: CoreWorkplanType[];
  timeslice: number;
}

function CoresTable ({ api, timeslice, workloadInfos, workplanInfos }: Props): React.ReactElement<Props> {
  const coreArr: number[] = useMemo(() => workloadInfos ? [...workloadInfos.map((plan) => plan.core)] : [], [workloadInfos]);
  const filteredList: CoreInfo[] = useMemo(() => coreArr.map((c) => ({
    core: c,
    workload: workloadInfos?.filter((v) => v.core === c),
    workplan: workplanInfos?.filter((v) => v.core === c)
  })), [workloadInfos, workplanInfos, coreArr]);

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
