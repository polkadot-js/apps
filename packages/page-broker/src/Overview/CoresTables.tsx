// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreInfo } from '../types.js';

import React from 'react';

import CoreTable from './CoreTable.js';
import { useBrokerConfig } from '@polkadot/react-hooks';

interface Props {
  api: ApiPromise;
  isApiReady: boolean;
  data: CoreInfo[];
}

function CoresTable({ api, isApiReady, data }: Props): React.ReactElement<Props> {
  const config = useBrokerConfig(api, isApiReady);
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
            config={config}
          />
        );
      })}
    </>
  );
}

export default React.memo(CoresTable);
