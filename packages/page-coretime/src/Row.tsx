// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FlagColor } from '@polkadot/react-components/types';
import type { ChainWorkTaskInformation, LegacyLease } from '@polkadot/react-hooks/types';

import React, { useMemo } from 'react';

import { MarkWarning, ParaLink, styled, Tag } from '@polkadot/react-components';
import { ChainRenewalStatus, CoreTimeTypes } from '@polkadot/react-hooks/constants';
import { BN, formatBalance, formatNumber } from '@polkadot/util';


import { estimateTime } from './utils/index.js';
import { useCoretimeContext } from './CoretimeContext.js';
import { ParaLinkType } from '@polkadot/react-components/ParaLink';

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

const StyledCell = styled.td<{ $p: boolean }>`
  && {
    background-color: ${({ $p }) => ($p ? '#F9FAFB' : undefined)};
  }
  height: 55px;
`;

const StyledMarkWarning = styled(MarkWarning)`
    width: fit-content;
    margin: 0;
    display: inline-block;
    vertical-align: middle;
  &.mark {
    margin: 0 0 0 1rem;
    display: inline;
  }
`;

const EXPIRES_IN_DAYS = 7

function Row({ chainRecord, highlight = false, id, lastCommittedTimeslice, lease, regionBegin, regionEnd }: Props): React.ReactElement<Props> {
  const chainRegionEnd = (chainRecord.renewalStatus === ChainRenewalStatus.Renewed ? regionEnd : regionBegin);
  const targetTimeslice = lease?.until || chainRegionEnd;
  const showEstimates = !!targetTimeslice && Object.values(CoreTimeTypes)[chainRecord.type] !== CoreTimeTypes.Reservation;
  const { coretimeInfo, get } = useCoretimeContext();
  const lastBlock = useMemo(() => get?.blocks.relay(targetTimeslice), [get, targetTimeslice])

  const estimatedTime = showEstimates && get && coretimeInfo &&
    estimateTime(targetTimeslice, get.blocks.relay(lastCommittedTimeslice), coretimeInfo?.constants?.relay);

  const isWithinWeek = estimatedTime && new Date(estimatedTime).getTime() - Date.now() < EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000;
  const isReservation = chainRecord.type === CoreTimeTypes.Reservation;

  return (
    <React.Fragment key={`${id}`}>
      <StyledCell $p={highlight}>{id}</StyledCell>
      <StyledCell
        $p={highlight}
        className='media--800'
      >{<ParaLink id={new BN(id)} />}</StyledCell>
      <StyledCell $p={highlight}>{chainRecord?.workload?.core}</StyledCell>
      <StyledCell $p={highlight}>
        <Tag
          color={colours[chainRecord.type] as FlagColor}
          label={Object.values(CoreTimeTypes)[chainRecord.type]}
        />
      </StyledCell>
      <StyledCell
        $p={highlight}
        className='media--800'
      >{showEstimates && lastBlock && <a target='_blank' rel='noreferrer' href={`https://polkadot.subscan.io/block/${lastBlock}`}>{formatNumber(lastBlock)}</a>}</StyledCell>
      <StyledCell
        $p={highlight}
        className='media--1000'
        style={{ whiteSpace: 'nowrap' }}
      >
        <span>
          {estimatedTime}
          {!!isWithinWeek && !isReservation && (
            <StyledMarkWarning
              content='Expires Soon'
            />
          )}
        </span>
      </StyledCell>
      <StyledCell
        $p={highlight}
        className='media--1200'
      >{chainRecord?.renewalStatus}</StyledCell>
      <StyledCell
        $p={highlight}
        className='media--1200'
      >{chainRecord?.renewal ? formatBalance(chainRecord.renewal?.price.toString()) : ''}</StyledCell>
      <StyledCell
        $p={highlight}
        className='media--800'
      >{<div style={{ display: 'flex', flexDirection: 'row', columnGap: '12px', alignItems: 'center', justifyContent: 'left' }}>
        <ParaLink id={new BN(id)} showLogo={false} type={ParaLinkType.SUBSCAN} />
        <div style={{ marginBottom: '2px' }}>
          <ParaLink id={new BN(id)} showLogo={false} type={ParaLinkType.HOME} />
        </div>
      </div>}</StyledCell>

      {highlight && <StyledCell $p={highlight} />}
    </React.Fragment>

  );
}

export default React.memo(Row);
