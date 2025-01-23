// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainName } from '../types.js';

import React from 'react';

import { useCoretimeContext } from '../CoretimeContext.js';
import ParachainsTable from '../ParachainsTable.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  chainName: ChainName
}

function Overview ({ chainName, className }: Props): React.ReactElement<Props> {
  const { coretimeInfo } = useCoretimeContext();

  return (
    <main className={className}>
      {coretimeInfo && (
        <Summary
          chainName={chainName}
          config={coretimeInfo?.config}
          constants={coretimeInfo?.constants}
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
