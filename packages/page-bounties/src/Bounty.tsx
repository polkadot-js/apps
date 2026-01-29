// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { BountyIndex } from '@polkadot/types/interfaces';
import type { PalletBountiesBounty } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { AddressSmall, Columar, ExpandButton, LinkExternal, styled, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { BountyActions } from './BountyActions/index.js';
import BountyExtraActions from './BountyExtraActions/index.js';
import BountyInfos from './BountyInfos/index.js';
import BountyActionMessage from './BountyNextActionInfo/BountyActionMessage.js';
import { getProposalToDisplay } from './helpers/extendedStatuses.js';
import { useBountyStatus } from './hooks/index.js';
import BountyStatusView from './BountyStatusView.js';
import Curator from './Curator.js';
import DueBlocks from './DueBlocks.js';
import { useTranslation } from './translate.js';
import VotersColumn from './VotersColumn.js';

interface Props {
  bestNumber: BN;
  bounty: PalletBountiesBounty;
  className?: string;
  description: string;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
}

function Bounty ({ bestNumber, bounty, className = '', description, index, proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isExpanded, toggleExpanded] = useToggle(false);

  const { bond, curatorDeposit, fee, proposer, status, value } = bounty;
  const { beneficiary, bountyStatus, curator, unlockAt, updateDue } = useBountyStatus(status);

  const blocksUntilUpdate = useMemo(() => updateDue?.sub(bestNumber), [bestNumber, updateDue]);
  const blocksUntilPayout = useMemo(() => unlockAt?.sub(bestNumber), [bestNumber, unlockAt]);

  const curatorToRender = useMemo(() => {
    if (curator) {
      return { curator, isFromProposal: false };
    }

    const proposalToDisplay = proposals && getProposalToDisplay(proposals, status);

    return (proposalToDisplay?.proposal?.method === 'proposeCurator')
      ? { curator: proposalToDisplay.proposal.args[1], isFromProposal: true }
      : null;
  }, [curator, proposals, status]);

  return (
    <>
      <StyledTr className={`${className} isExpanded isFirst ${isExpanded ? '' : 'isLast'}`}>
        <Table.Column.Id value={index} />
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
        <Table.Column.Balance value={value} />
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
              label={t('payout')}
            />
          )}
          {blocksUntilUpdate && updateDue && (
            <DueBlocks
              dueBlocks={blocksUntilUpdate}
              endBlock={updateDue}
              label={t('update')}
            />
          )}
          <BountyActionMessage
            bestNumber={bestNumber}
            blocksUntilUpdate={blocksUntilUpdate}
            status={status}
          />
          <BountyActions
            bestNumber={bestNumber}
            description={description}
            fee={fee}
            index={index}
            proposals={proposals}
            status={status}
            value={value}
          />
        </td>
        <td>
          <BountyInfos
            beneficiary={beneficiary}
            proposals={proposals}
            status={status}
          />
        </td>
        <td className='actions'>
          <div>
            <BountyExtraActions
              bestNumber={bestNumber}
              description={description}
              index={index}
              proposals={proposals}
              status={status}
            />
            <ExpandButton
              expanded={isExpanded}
              onClick={toggleExpanded}
            />
          </div>
        </td>
      </StyledTr>
      <StyledTr className={`${className} ${isExpanded ? 'isExpanded isLast' : 'isCollapsed'}`}>
        <td />
        <td
          className='columar'
          colSpan={3}
        >
          <Columar>
            <Columar.Column>
              <LinkExternal
                data={index}
                type='bounty'
                withTitle
              />
            </Columar.Column>
            <Columar.Column>
              <div className='column'>
                <h5>{t('Proposer')}</h5>
                <AddressSmall value={proposer} />
              </div>
              <div className='column'>
                <h5>{t('Bond')}</h5>
                <div className='inline-balance'><FormatBalance value={bond} /></div>
              </div>
              {curator && (
                <div className='column'>
                  <h5>{t("Curator's fee")}</h5>
                  <div className='inline-balance'>{<FormatBalance value={fee} />}</div>
                </div>
              )}
              <div className='column'>
                {curator && !curatorDeposit.isZero() && (
                  <>
                    <h5>{t("Curator's deposit")}</h5>
                    <div className='inline-balance'>
                      <FormatBalance value={curatorDeposit} />
                    </div>
                  </>
                )}
              </div>
            </Columar.Column>
          </Columar>
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
      </StyledTr>
    </>
  );
}

const StyledTr = styled.tr`
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

  & .inline-balance {
    width: 50%;
    font-size: var(--font-size-base);
    line-height: normal;
  }

  .column {
    align-items: center;
    display: flex;
    padding: 0 0 0.5rem;

    h5 {
      text-align: right;
      padding: 0 1.7rem 0 0;
      width: 50%;
    }
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
    font-size: var(--font-size-tiny);
    line-height: 1.5rem;
    color: var(--color-label);
  }

  & .votes-table {
    display: flex;
    justify-content: space-between;
  }
`;

export default React.memo(Bounty);
