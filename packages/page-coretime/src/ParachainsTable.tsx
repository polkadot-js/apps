// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { type CoretimeInformation } from '@polkadot/react-hooks/types';

import ParachainTableRow from './ParachainTableRow.js';
import { useTranslation } from './translate.js';

interface Props {
  coretimeInfo: CoretimeInformation
}

function ParachainsTable ({ coretimeInfo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('parachains'), 'start'],
    [t('name'), 'start'],
    [t('core number'), 'start'],
    [t('type'), 'start'],
    [t('last block'), 'start'],
    [t('end'), 'start'],
    [t('renewal'), 'start'],
    [t('renewal price'), 'start'],
    [t('other cores'), 'other cores']
  ]);

  return (
    <Table
      emptySpinner={false}
      header={headerRef.current}
      isSplit={false}
    >
      {coretimeInfo?.taskIds?.map((taskId: number) => {
        const chain = coretimeInfo.chainInfo[taskId];

        return (
          <ParachainTableRow
            chain={chain}
            key={chain.id}
            lastCommittedTimeslice={coretimeInfo.status.lastCommittedTimeslice}
            regionBegin={coretimeInfo.salesInfo.regionBegin}
            regionEnd={coretimeInfo.salesInfo.regionEnd}
          />
        );
      })}

    </Table>
  );
}

export default React.memo(ParachainsTable);
