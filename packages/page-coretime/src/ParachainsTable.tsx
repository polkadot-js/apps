// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { ParaLink, Table, Tag } from '@polkadot/react-components';
import { useTranslation } from './translate.js';
import { BN } from '@polkadot/util';
import { useApi, useCoreDescriptor } from '@polkadot/react-hooks';
import { estimateTime } from './utils.js';
import { CoretimeInformation } from '@polkadot/react-hooks/types';
import { FlagColor } from '@polkadot/react-components/types';
import { formatBalance } from '@polkadot/util';
import { formatNumber } from 'chart.js/helpers';


export enum CoreTimeTypes {
  'Reservation',
  'Lease',
  'Bulk Coretime',
  'On Demand'
}

interface Props {
  ids: number[]
  coretimeInfo: CoretimeInformation
}

const colours: Record<string, string> = {
  [CoreTimeTypes.Reservation]: 'orange',
  [CoreTimeTypes.Lease]: 'blue',
  [CoreTimeTypes['Bulk Coretime']]: 'pink',
}


function ParachainsTable({ ids, coretimeInfo }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();
  const coreInfos = useCoreDescriptor(api, isApiReady);
  const { t } = useTranslation();
  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('parachains'), 'start'],
    [t('name'), 'start'],
    // ['', 'media--1400'],
    [t('core number'), 'start'],
    [t('type'), 'start'],
    [t('last block'), 'start'],
    [t('end'), 'start'],
    [t('renewal'), 'start'],
    [t('renewal price'), 'start'],
    // [t('chain'), 'no-pad-left'],
    // [t('in/out'), 'media--1700', 2],
    // [t('leases'), 'media--1100']
  ]);
  return (
    <Table
      emptySpinner={false}
      header={headerRef.current}
      isSplit={false}
    >
      {ids && coretimeInfo && ids.map((id: number) => {
        const chain = coretimeInfo.chainInfo[id]
        const onCore = coreInfos?.some(one => one.info?.currentWork.assignments.some(value => value.task === id.toString())) ? 'yes' : 'no';
        const type = !!chain?.lease ? CoreTimeTypes.Lease : !!chain?.reservation ? CoreTimeTypes.Reservation : CoreTimeTypes['Bulk Coretime']
        const targetTimeslice = chain?.lease?.until || coretimeInfo.salesInfo.regionEnd
        const showEsimates = !!targetTimeslice && type !== CoreTimeTypes.Reservation
        // const renewBefore = 

        return (
          <tr key={id}>
            <td>{id}</td>
            <td><ParaLink id={new BN(id)} key={id} /></td>
            <td>{chain?.workload?.core || onCore}</td>
            <td>
              <Tag
                color={colours[type] as FlagColor}
                label={Object.values(CoreTimeTypes)[type]}
              />
            </td>
            <td>{showEsimates && formatNumber(targetTimeslice * 80).toString()}</td>
            <td>{showEsimates && estimateTime(targetTimeslice, coretimeInfo.status.lastCommittedTimeslice * 80)}</td>
            <td>{!!chain.renewal ? "renewed" : ""}</td>
            <td>{!!chain.renewal ? formatBalance(chain.renewal?.price.toString()) : ""}</td>
          </tr>
        )
      }
      )}

    </Table>
  );
}

export default React.memo(ParachainsTable);
