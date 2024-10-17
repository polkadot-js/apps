// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FlagColor } from '@polkadot/react-components/types';
import type { CoretimeInformation } from '@polkadot/react-hooks/types';

import React, { useRef } from 'react';

import { ParaLink, Table, Tag } from '@polkadot/react-components';
import { BN, formatBalance, formatNumber } from '@polkadot/util';

import { useTranslation } from './translate.js';
import { estimateTime } from './utils.js';

export enum CoreTimeTypes {
  'Reservation',
  'Lease',
  'Bulk Coretime',
  'On Demand'
}

interface Props {
  coretimeInfo: CoretimeInformation
}

const colours: Record<string, string> = {
  [CoreTimeTypes.Reservation]: 'orange',
  [CoreTimeTypes.Lease]: 'blue',
  [CoreTimeTypes['Bulk Coretime']]: 'pink'
};

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
    [t('renewal price'), 'start']
  ]);

  return (
    <Table
      emptySpinner={false}
      header={headerRef.current}
      isSplit={false}
    >
      {coretimeInfo?.taskIds?.map((taskId: number) => {
        const chain = coretimeInfo.chainInfo[taskId];
        const type = chain?.lease ? CoreTimeTypes.Lease : chain?.reservation ? CoreTimeTypes.Reservation : CoreTimeTypes['Bulk Coretime'];
        const targetTimeslice = chain?.lease?.until || coretimeInfo.salesInfo.regionEnd;
        const showEsimates = !!targetTimeslice && type !== CoreTimeTypes.Reservation;

        return (
          <tr key={taskId}>
            <td>{taskId}</td>
            <td>
              <ParaLink
                id={new BN(taskId)}
              />
            </td>
            <td>{chain?.workload?.core}</td>
            <td>
              <Tag
                color={colours[type] as FlagColor}
                label={Object.values(CoreTimeTypes)[type]}
              />
            </td>
            <td>{showEsimates && formatNumber(targetTimeslice * 80).toString()}</td>
            <td>{showEsimates && estimateTime(targetTimeslice, coretimeInfo.status.lastCommittedTimeslice * 80)}</td>
            <td>{chain?.renewal ? 'renewed' : ''}</td>
            <td>{chain?.renewal ? formatBalance(chain.renewal?.price.toString()) : ''}</td>
          </tr>
        );
      }
      )}

    </Table>
  );
}

export default React.memo(ParachainsTable);
