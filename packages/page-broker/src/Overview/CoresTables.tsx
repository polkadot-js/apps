// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreInfo } from '../types.js';

import React from 'react';

import CoreTable from './CoreTable.js';

interface Props {
  api: ApiPromise;
  data: CoreInfo[];
}

function CoresTable ({ api, data }: Props): React.ReactElement<Props> {
  return (
    <>
      {data?.map((coreData) => {
        return (
          <CoreTable
            api={api}
            core={coreData?.core}
            key={coreData?.core}
            workload={coreData?.workload}
            workplan={coreData?.workplan}
          />
        );
      })}
    </>
  );
}

export default React.memo(CoresTable);
