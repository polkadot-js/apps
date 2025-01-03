// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { CoreInfo } from '../types.js';

import React from 'react';

import { useBrokerConfig } from '@polkadot/react-hooks';

import CoreTable from './CoreTable.js';

interface Props {
  api: ApiPromise;
  isApiReady: boolean;
  data: CoreInfo[];
}

function CoresTable ({ api, data, isApiReady }: Props): React.ReactElement<Props> {
  const config = useBrokerConfig(api, isApiReady);

  return (
    <>
      {config && data?.map((coreData) => {
        return (
          <CoreTable
            api={api}
            config={config}
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
