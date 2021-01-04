// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber, Bounty as BountyType } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { AddressSmall, Icon, LinkExternal } from '@polkadot/react-components';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { BountyActions } from './BountyActions';
import { getBountyStatus } from './helpers';
import { useTranslation } from './translate';

interface Props {
  bestNumber: BlockNumber;
  bounty: BountyType;
  className?: string;
  description: string;
  index: number;
}

interface DueProps {
  dueBlocks: BN | undefined;
}

const EMPTY_CELL = '-';

function Bounty ({ bestNumber, bounty, className = '', description, index }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const { bond, curatorDeposit, fee, proposer, status, value } = bounty;

  const updateStatus = useCallback(() => getBountyStatus(status), [status]);

  const { beneficiary, bountyStatus, curator, unlockAt, updateDue } = updateStatus();

  const blocksUntilUpdate = useMemo(() => updateDue?.sub(bestNumber), [bestNumber, updateDue]);
  const blocksUntilPayout = useMemo(() => unlockAt?.sub(bestNumber), [bestNumber, unlockAt]);

  const handleOnIconClick = useCallback(
    () => setIsExpanded((isExpanded) => !isExpanded),
    []
  );

  return (
    <>
      <tr className={className}>
        <td>{bountyStatus}</td>
        <td>{description}</td>
        <td><FormatBalance value={value} /></td>
        <td>{curator ? <AddressSmall value={curator} /> : EMPTY_CELL}</td>
        <td><DueBlocks dueBlocks={blocksUntilUpdate} /></td>
        <td>{beneficiary ? <AddressSmall value={beneficiary} /> : EMPTY_CELL}</td>
        <td><DueBlocks dueBlocks={blocksUntilPayout} /></td>
        <td>
          <BountyActions
            bestNumber={bestNumber}
            index={index}
            status={status}
          />
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
        style={{ visibility: isExpanded ? 'visible' : 'collapse' }}>
        <td />
        <td className='proposer'>
          <div className='label'>{t('Proposer')}</div>
          <AddressSmall value={proposer} />
        </td>
        <td className='column-with-label'>
          <div className='label'>{t('Value')}</div>
          <div className='label'>{t('Bond')}</div>
        </td>
        <td >
          <div className='inline-balance'><FormatBalance value={value} /></div>
          <div className='inline-balance'><FormatBalance value={bond} /></div>
        </td>
        <td className='column-with-label'>
          <div className='label'>{t('Curators fee')}</div>
          <div className='label'>{t('Curators deposit')}</div>
        </td>
        <td>
          <div className='inline-balance'>{curator ? <FormatBalance value={fee} /> : EMPTY_CELL}</div>
          <div className='inline-balance'>{curator ? <FormatBalance value={curatorDeposit} /> : EMPTY_CELL}</div>
        </td>
        <td />
        <td />
        <td />
        <td />
      </tr>
    </>
  );
}

function DueBlocks ({ dueBlocks }: DueProps): React.ReactElement<DueProps> {
  const { t } = useTranslation();

  if (!dueBlocks) {
    return <>{EMPTY_CELL}</>;
  }

  return dueBlocks.gtn(0)
    ? <>
      <BlockToTime blocks={dueBlocks} />
      {t<string>('{{blocks}} blocks', { replace: { blocks: formatNumber(dueBlocks) } })}
    </>
    : <>{t('Claimable')}</>;
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
`);
