// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0


import React from 'react';

import { useApi } from '@polkadot/react-hooks';

import Summary from './Summary.js';
import ParachainsTable from '../ParachainsTable.js';
import { CoretimeInformation } from '@polkadot/react-hooks/types';

interface Props {
  className?: string;
  coretimeInfo: CoretimeInformation
}

function Overview({ className, coretimeInfo }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  return (
    <main className={className}>
      {coretimeInfo && (
        <Summary
          api={isApiReady ? api : null}
          config={coretimeInfo?.config}
          parachainCount={coretimeInfo.taskIds?.length || 0}
          region={coretimeInfo?.region}
          saleInfo={coretimeInfo?.salesInfo}
          status={coretimeInfo?.status}
        />
      )}
      {!!coretimeInfo &&
        <ParachainsTable
          coretimeInfo={coretimeInfo}
        />
      }
    </main>
  );
}

export default React.memo(Overview);
