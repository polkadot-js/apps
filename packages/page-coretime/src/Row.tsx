// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FlagColor } from '@polkadot/react-components/types';
import type { ChainWorkTaskInformation, LegacyLease } from '@polkadot/react-hooks/types';

import React from 'react';

import { MarkWarning, ParaLink, styled, Tag } from '@polkadot/react-components';
import { ParaLinkType } from '@polkadot/react-components/ParaLink';
import { ChainRenewalStatus, CoreTimeTypes } from '@polkadot/react-hooks/constants';
import { BN, formatBalance, formatNumber } from '@polkadot/util';

import { coretimeTypeColours, estimateTime } from './utils/index.js';
import { useCoretimeContext } from './CoretimeContext.js';

interface Props {
  id: number
  chainRecord: ChainWorkTaskInformation
  regionEnd: number
  regionBegin: number
  lastCommittedTimeslice: number
  lease: LegacyLease | undefined
  highlight?: boolean
}

interface StyledCellProps {
  $p: boolean;
  $width?: string;
}

const StyledCell = styled.td<StyledCellProps>`
  && {
    background-color: ${({ $p }) => ($p ? '#F9FAFB' : undefined)};
    width: ${({ $width }) => $width};
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

const EXPIRES_IN_DAYS = 7;

function Row ({ chainRecord, highlight = false, id, lastCommittedTimeslice, lease, regionBegin, regionEnd }: Props): React.ReactElement<Props> {
  const chainRegionEnd = (chainRecord.renewalStatus === ChainRenewalStatus.Renewed ? regionEnd : regionBegin);
  const targetTimeslice = lease?.until || chainRegionEnd;
  const showEstimates = !!targetTimeslice && Object.values(CoreTimeTypes)[chainRecord.type] !== CoreTimeTypes.Reservation;
  const { coretimeInfo, get } = useCoretimeContext();

  const estimatedTime = showEstimates && get && coretimeInfo &&
    estimateTime(targetTimeslice, get.blocks.relay(lastCommittedTimeslice), coretimeInfo?.constants?.relay);

  const isWithinWeek = estimatedTime && new Date(estimatedTime).getTime() - Date.now() < EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000;
  const isReservation = chainRecord.type === CoreTimeTypes.Reservation;

  return (
    <React.Fragment key={`${id}`}>
      <StyledCell
        $p={highlight}
        $width='150px'
      >{id}</StyledCell>
      <StyledCell
        $p={highlight}
        $width='150px'
        className='media--800'
      >{<ParaLink id={new BN(id)} />}</StyledCell>
      <StyledCell $p={highlight}>{chainRecord?.workload?.core}</StyledCell>
      <StyledCell $p={highlight}>
        <Tag
          color={coretimeTypeColours[chainRecord.type] as FlagColor}
          label={Object.values(CoreTimeTypes)[chainRecord.type]}
        />
      </StyledCell>
      <StyledCell
        $p={highlight}
        className='media--800'
      >{showEstimates && chainRecord?.lastBlock &&
        <a
          href={`https://polkadot.subscan.io/block/${chainRecord?.lastBlock}`}
          rel='noreferrer'
          target='_blank'
        >{formatNumber(chainRecord?.lastBlock)}
        </a>}
      </StyledCell>
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
      >{<div style={{ alignItems: 'center', columnGap: '12px', display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
          <ParaLink
            id={new BN(id)}
            showLogo={false}
            type={ParaLinkType.SUBSCAN}
          />
          <div style={{ marginBottom: '2px' }}>
            <ParaLink
              id={new BN(id)}
              showLogo={false}
              type={ParaLinkType.HOME}
            />
          </div>
        </div>}
      </StyledCell>
      {highlight && <StyledCell $p={highlight} />}
    </React.Fragment>

  );
}

export default React.memo(Row);
