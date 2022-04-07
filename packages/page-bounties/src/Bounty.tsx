// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BlockNumber, Bounty as BountyType, BountyIndex } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { AddressSmall, ExpandButton, LinkExternal } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import BountyActionMessage from './BountyNextActionInfo/BountyActionMessage';
import { getProposalToDisplay } from './helpers/extendedStatuses';
import { BountyActions } from './BountyActions';
import BountyExtraActions from './BountyExtraActions';
import BountyInfos from './BountyInfos';
import BountyStatusView from './BountyStatusView';
import Curator from './Curator';
import DueBlocks from './DueBlocks';
import { useBountyStatus } from './hooks';
import { useTranslation } from './translate';
import VotersColumn from './VotersColumn';

interface Props {
  bestNumber: BlockNumber;
  bounty: BountyType;
  className?: string;
  description: string;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
}

const EMPTY_CELL = '-';

function Bounty ({ bestNumber, bounty, className = '', description, index, proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const { bond, curatorDeposit, fee, proposer, status, value } = bounty;
  const { beneficiary, bountyStatus, curator, unlockAt, updateDue } = useBountyStatus(status);

  const blocksUntilUpdate = useMemo(() => updateDue?.sub(bestNumber), [bestNumber, updateDue]);
  const blocksUntilPayout = useMemo(() => unlockAt?.sub(bestNumber), [bestNumber, unlockAt]);

  const curatorToRender = useMemo(() => {
    if (curator) {
      return { curator, isFromProposal: false };
    }

    const proposalToDisplay = proposals && getProposalToDisplay(proposals, status);

    return (proposalToDisplay?.proposal.method === 'proposeCurator')
      ? { curator: proposalToDisplay.proposal.args[1], isFromProposal: true }
      : null;
  }, [curator, proposals, status]);

  const handleOnIconClick = useCallback(
    () => setIsExpanded((isExpanded) => !isExpanded),
    []
  );

  return (
    <>
      <tr className={`${className}${isExpanded ? ' noBorder' : ''}`}>
        <td className='number'><h1>{formatNumber(index)}</h1></td>
        <td
          className='description-column'
          data-testid='description'
        >
          <div title={description}>
            {description}
          </div>
        </td>
        <td>
          <BountyStatusView bountyStatus={bountyStatus} />
        </td>
        <td><FormatBalance value={value} /></td>
        <td>
          {curatorToRender && (
            <Curator
              curator={curatorToRender.curator}
              isFromProposal={curatorToRender.isFromProposal}
            />
          )}
        </td>
        <td>
          {blocksUntilPayout && unlockAt && (
            <DueBlocks
              dueBlocks={blocksUntilPayout}
              endBlock={unlockAt}
              label={t<string>('payout')}
            />
          )}
          {blocksUntilUpdate && updateDue && (
            <DueBlocks
              dueBlocks={blocksUntilUpdate}
              endBlock={updateDue}
              label={t<string>('update')}
            />
          )}
          <BountyActionMessage
            bestNumber={bestNumber}
            blocksUntilUpdate={blocksUntilUpdate}
            status={status}
          />
        </td>
        <td className='td-info-action-row'>
          <div className='td-row'>
            <BountyInfos
              beneficiary={beneficiary}
              proposals={proposals}
              status={status}
            />
            <div className='bounty-action-row'>
              <BountyActions
                bestNumber={bestNumber}
                description={description}
                fee={fee}
                index={index}
                proposals={proposals}
                status={status}
                value={value}
              />
            </div>
          </div>
        </td>
        <td className='fast-actions'>
          <div className='fast-actions-row'>
            <LinkExternal
              data={index}
              isLogo
              type='bounty'
            />
            <BountyExtraActions
              bestNumber={bestNumber}
              description={description}
              index={index}
              proposals={proposals}
              status={status}
            />
            <ExpandButton
              expanded={isExpanded}
              onClick={handleOnIconClick}
            />
          </div>
        </td>
      </tr>
      <tr className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'}`}>
        <td colSpan={2}>
          <div className='label-column-left'>
            <div className='label'>{t('Proposer')}</div>
            <AddressSmall value={proposer} />
          </div>
        </td>
        <td colSpan={2}>
          <div className='label-column-right'>
            <div className='label'>{t('Bond')}</div>
            <div className='inline-balance'><FormatBalance value={bond} /></div>
          </div>
          <div className='label-column-right'>
            <div className='label'>{t("Curator's fee")}</div>
            <div className='inline-balance'>{curator ? <FormatBalance value={fee} /> : EMPTY_CELL}</div>
          </div>
          <div className='label-column-right'>
            <div className='label'>{t("Curator's deposit")}</div>
            <div className='inline-balance'>{curator ? <FormatBalance value={curatorDeposit} /> : EMPTY_CELL}</div>
          </div>
        </td>
        <td />
        <td />
        <td>
          {proposals && (
            <div className='votes-table'>
              <VotersColumn
                option={'ayes'}
                proposals={proposals}
                status={status}
              />
              <VotersColumn
                option={'nays'}
                proposals={proposals}
                status={status}
              />
            </div>
          )}
        </td>
        <td />
      </tr>
    </>
  );
}

export default React.memo(styled(Bounty)`
  &.isCollapsed {
    visibility: collapse;
  }

  &.isExpanded {
    visibility: visible;
  }

  .description-column {
    max-width: 200px;

    div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  & .links {
    display: inline-flex;
  }

  & td.fast-actions {
    padding-left: 0.2rem;
    width: 1%;

    .fast-actions-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      & > * + * {
        margin-left: 0.285rem;
      }
    }
  }

  & .inline-balance {
    width: 50%;
    font-size: 1rem;
    line-height: normal;
  }

  .label {
    text-align: right;
    padding: 0 1.7rem 0 0;
    line-height: normal;
    color: var(--color-label);
    text-transform: lowercase;
  }

  .label-column-right, .label-column-left{
   display: flex;
    align-items: center;

    .label {
      width: 50%;
    }
  }

  .label-column-right {
    padding: 0 0 0.5rem;
  }

  .label-column-left {
    padding: 0 0 0.5rem;
  }

  & .td-info-action-row {
    padding-right: 0;
  }

  .td-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & :only-child {
      margin-left: auto;
    }
  }

  .bounty-action-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    & > * + * {
      margin-left: 0.6rem;
    }
  }

  .block-to-time {
    font-size: 0.7rem;
    line-height: 1.5rem;
    color: var(--color-label);
  }

  & .votes-table {
    display: flex;
    justify-content: space-between;
  }
`);
