// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber, Bounty as BountyType } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { BountyDescription } from '@polkadot/app-bounties/types';
import { AddressSmall, Icon, LinkExternal } from '@polkadot/react-components';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { getBountyStatus } from './helpers';
import { useTranslation } from './translate';

interface Props {
  bestNumber: BlockNumber;
  bounty: BountyType;
  className?: string;
  description: BountyDescription;
  index: number;
}

const EMPTY_CELL = '-';

function Bounty ({ bestNumber, bounty, className = '', description, index }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const { bond, curatorDeposit, fee, proposer, status, value }: BountyType = bounty;

  const updateStatus = useCallback(() => getBountyStatus(status), [status]);

  const { bountyStatus, curator, updateDue } = updateStatus();

  const blocksUntilUpdate = useMemo(() => updateDue?.sub(bestNumber), [bestNumber, updateDue]);

  const handleOnIconClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <tr className={className}>
        <td>{bountyStatus}</td>
        <td className='title-column'>{description.description}</td>
        <td className='column-with-label'/>
        <td><FormatBalance value={value} /></td>
        <td className='column-with-label'/>
        <td className='column-curator'>{curator ? <AddressSmall value={curator}/> : EMPTY_CELL}</td>
        <td>
          {updateDue ? <BlockToTime blocks={blocksUntilUpdate} /> : EMPTY_CELL}
          {updateDue && t<string>('{{blocks}} blocks', { replace: { blocks: formatNumber(blocksUntilUpdate) } })}
        </td>
        <td className='table-column-icon'>
          <LinkExternal
            data={index}
            isLogo
            type='bounty'
          />
        </td>
        <td className='table-column-icon'>
          <div onClick={handleOnIconClick}>
            <Icon
              icon={
                isExpanded
                  ? 'caret-up'
                  : 'caret-down'
              }
            />
          </div>
        </td>
      </tr>
      <tr className={className}
        style={{ display: isExpanded ? 'table-row' : 'none' }}>
        <td />
        <td className='proposer'>
          <div className='label'>Proposer</div>
          <AddressSmall value={proposer} />
        </td>
        <td className='column-with-label'>
          <div className='label'>Value</div>
          <div className='label'>Bond</div>
        </td>
        <td >
          <div className='inline-balance'><FormatBalance value={value} /></div>
          <div className='inline-balance'><FormatBalance value={bond} /></div>
        </td>
        <td className='column-with-label'>
          <div className='label'>Curators fee</div>
          <div className='label'>Curators deposit</div>
        </td>
        <td>
          <div className='inline-balance'>{curator ? <FormatBalance value={fee} /> : EMPTY_CELL }</div>
          <div className='inline-balance'>{curator ? <FormatBalance value={curatorDeposit} /> : EMPTY_CELL }</div>
        </td>
        <td />
        <td />
        <td />
      </tr>
    </>
  );
}

export default React.memo(styled(Bounty)`
  & .links {
    display: inline-flex;
  }
  
  & .table-column-icon {
    width: 52px;
    padding: 0;

    div {
      padding: 0.75rem;
      cursor: pointer;
    }
  }

  & .inline-balance {
    display: inline-block;
    width: 100%;
    margin: 12px 0;
    font-size: 1rem;
    line-height: normal;
  }

  & .column-with-label {
    width: 110px;
    vertical-align: middle;
    padding: 0;
    div {
      text-align: right;
      padding: 12px 0 12px 0;
      font-size: 0.7rem;
      line-height: normal;
      text-transform: uppercase;
      color: #4D4D4D;
      &:nth-child(2){
        padding: 18px 0 10px 0;
      }
    }
  }

  & .column-curator {
    width: 100px;
  }

  & .proposer {
    vertical-align: middle;
    div {
      display: inline-block;
    }
    .label {
      text-align: right;
      padding: 12px 12px 12px 0;
      font-size: 0.7rem;
      line-height: normal;
      text-transform: uppercase;
      color: #4D4D4D;
    }
  }
  & .title-column {
    min-width: 20rem;
  }
`);
