// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreWorkload, CoreWorkplan } from '@polkadot/react-hooks/types';
import type { CoreInfo } from '../types.js';

import React from 'react';

import CoreTable from './CoreTable.js';

interface Props {
  api: ApiPromise;
  cores?: number;
  workloadInfos?: CoreWorkload[];
  workplanInfos?: CoreWorkplan[];
  timeslice: number;
}

function CoresTable({ api, cores, timeslice, workloadInfos, workplanInfos }: Props): React.ReactElement<Props> {
  const coreArr = [];

  if (cores === -1 && !!workloadInfos) {
    coreArr.push(...workloadInfos.map((plan) => plan.core));
  } else if (cores !== undefined) {
    coreArr.push(cores);
  }

  const filteredList: CoreInfo[] = coreArr.map((c) => ({
    core: c,
    workload: workloadInfos?.filter((v) => v.core === c),
    workplan: workplanInfos?.filter((v) => v.core === c)
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
