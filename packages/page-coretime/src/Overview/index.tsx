// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoretimeInformation } from '@polkadot/react-hooks/types';

import React from 'react';

import { useApi } from '@polkadot/react-hooks';

import ParachainsTable from '../ParachainsTable.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  coretimeInfo: CoretimeInformation
  chainName: string
}

function Overview ({ chainName, className, coretimeInfo }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();

  return (
    <main className={className}>
      {coretimeInfo && (
        <Summary
          api={isApiReady ? api : null}
          chainName={chainName}
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
