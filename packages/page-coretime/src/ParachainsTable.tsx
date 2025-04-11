// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RelayName } from './types.js';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';
import { type CoretimeInformation } from '@polkadot/react-hooks/types';

import Filters from './Overview/Filters.js';
import ParachainTableRow from './ParachainTableRow.js';
import { useTranslation } from './translate.js';

interface Props {
  coretimeInfo: CoretimeInformation
  relayName: RelayName
}

function ParachainsTable ({ coretimeInfo, relayName }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('parachains'), 'start'],
    [t('name'), 'start media--800'],
    [t('core number'), 'start'],
    [t('type'), 'start'],
    [t('last block'), 'start media--800'],
    [t('end date (approx)'), 'start media--1000'],
    [t('renewal'), 'start media--1200'],
    [t('renewal price'), 'start media--1200'],
    [t('links'), 'start media--800'],
    [t('other cores'), 'end']
  ]);

  const [taskIds, setTaskIds] = useState<number[]>([]);

  const onFilter = useCallback((filteredData: number[]) => {
    setTaskIds(filteredData);
  }, []);

  useEffect(() => {
    if (coretimeInfo?.taskIds) {
      setTaskIds(coretimeInfo?.taskIds);
    }
  }, [coretimeInfo?.taskIds]);

  return (
    <>
      <Filters
        chainInfo={coretimeInfo?.chainInfo}
        data={coretimeInfo?.taskIds}
        onFilter={onFilter}
      />
      <Table
        emptySpinner={false}
        header={headerRef.current}
        isSplit={false}
      >
        {taskIds?.map((taskId: number) => {
          const chain = coretimeInfo.chainInfo[taskId];

          if (!chain) {
            return null;
          }

          return (
            <ParachainTableRow
              chain={chain}
              key={chain.id}
              lastCommittedTimeslice={coretimeInfo.status.lastCommittedTimeslice}
              regionBegin={coretimeInfo.salesInfo.regionBegin}
              regionEnd={coretimeInfo.salesInfo.regionEnd}
              relayName={relayName}
            />
          );
        })}

      </Table>
    </>
  );
}

export default React.memo(ParachainsTable);
