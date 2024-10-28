// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FlagColor } from '@polkadot/react-components/types';
import type { ChainWorkTaskInformation, LegacyLease } from '@polkadot/react-hooks/types';

import React from 'react';

import { ParaLink, styled, Tag } from '@polkadot/react-components';
import { ChainRenewalStatus } from '@polkadot/react-hooks/types';
import { BN, formatBalance, formatNumber } from '@polkadot/util';

import { CoreTimeTypes } from './types.js';
import { estimateTime } from './utils.js';

interface Props {
  id: number
  chainRecord: ChainWorkTaskInformation
  regionEnd: number
  regionBegin: number
  lastCommittedTimeslice: number
  lease: LegacyLease | undefined
  highlight?: boolean
}

const colours: Record<string, string> = {
  [CoreTimeTypes.Reservation]: 'orange',
  [CoreTimeTypes.Lease]: 'blue',
  [CoreTimeTypes['Bulk Coretime']]: 'pink'
};

const StyledCell = styled.td<{ p: boolean }>`
  && {
    background-color: ${({ p }) => (p ? '#F9FAFB' : '')};
  }
`;

function Row ({ chainRecord, highlight = false, id, lastCommittedTimeslice, lease, regionBegin, regionEnd }: Props): React.ReactElement<Props> {
  const chainRegionEnd = (chainRecord.renewalStatus === ChainRenewalStatus.Renewed ? regionEnd : regionBegin);
  const targetTimeslice = lease?.until || chainRegionEnd;
  const showEstimates = !!targetTimeslice && Object.values(CoreTimeTypes)[chainRecord.type] !== CoreTimeTypes.Reservation;

  return (
    <React.Fragment key={`${id}`}>
      <StyledCell p={highlight}>{id}</StyledCell>
      <StyledCell p={highlight}>{<ParaLink id={new BN(id)} />}</StyledCell>
      <StyledCell p={highlight}>{chainRecord?.workload?.core}</StyledCell>
      <StyledCell p={highlight}>
        <Tag
          color={colours[chainRecord.type] as FlagColor}
          label={Object.values(CoreTimeTypes)[chainRecord.type]}
        />
      </StyledCell>
      <StyledCell p={highlight}>{showEstimates && formatNumber(targetTimeslice * 80).toString()}</StyledCell>
      <StyledCell p={highlight}>{showEstimates && estimateTime(targetTimeslice, lastCommittedTimeslice * 80)}</StyledCell>
      <StyledCell p={highlight}>{chainRecord?.renewalStatus}</StyledCell>
      <StyledCell p={highlight}>{chainRecord?.renewal ? formatBalance(chainRecord.renewal?.price.toString()) : ''}</StyledCell>
      {highlight && <StyledCell p={highlight} />}
    </React.Fragment>

  );
}

export default React.memo(Row);
