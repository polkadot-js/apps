// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Referendum as ReferendumType, ReputationTally } from '../types.js';

import React from 'react';

import { AddressMini, Expander, styled, Table, Tag } from '@polkadot/react-components';
import { usePreimage, useToggle } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import DecisionDeposit from './DecisionDeposit.js';
import Tally from './Tally.js';
import Vote from './Vote.js';

interface Props {
  className?: string;
  tally?: ReputationTally;
  value: ReferendumType;
}

function Referendum ({ className = '', tally, value: { id, info } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isExpanded, toggleExpanded] = useToggle(false);

  const isOngoing = info.isOngoing;
  const ongoing = isOngoing ? info.asOngoing : null;

  const preimage = usePreimage(ongoing?.proposal);

  if (!isOngoing) {
    return null;
  }

  const status = ongoing?.deciding?.isSome
    ? t('Deciding')
    : t('Preparing');

  return (
    <>
      <StyledTr className={`${className} isExpanded isFirst ${isExpanded ? '' : 'isLast'}`}>
        <Table.Column.Id value={id} />
        <td className='all'>
          {ongoing?.origin && (
            <Tag
              color='lightgrey'
              label={ongoing.origin.type}
            />
          )}
          {preimage?.proposal && (
            <span className='shortHash'>
              {preimage.proposal.section}.{preimage.proposal.method}
            </span>
          )}
        </td>
        <td className='number'>
          <Tag
            color={ongoing?.deciding?.isSome ? 'green' : 'yellow'}
            label={status}
          />
        </td>
        <td className='number'>
          <Tally tally={tally} />
        </td>
        <td className='button'>
          {ongoing?.deciding?.isNone && ongoing?.track && ongoing?.decisionDeposit?.isNone && (
            <DecisionDeposit
              id={id}
              trackId={ongoing.track}
            />
          )}
          <Vote id={id} />
        </td>
        <Table.Column.Expand
          isExpanded={isExpanded}
          toggle={toggleExpanded}
        />
      </StyledTr>
      <StyledTr className={`${className} ${isExpanded ? 'isExpanded isLast' : 'isCollapsed'}`}>
        <td />
        <td colSpan={4}>
          {isExpanded && ongoing && (
            <div className='details'>
              {ongoing.submissionDeposit && (
                <div>
                  <strong>{t('Submitted by')}:</strong>{' '}
                  <AddressMini value={ongoing.submissionDeposit.who} />
                </div>
              )}
              {ongoing.submitted && (
                <div>
                  <strong>{t('Submitted at')}:</strong>{' '}
                  #{formatNumber(ongoing.submitted)}
                </div>
              )}
              {ongoing.deciding?.isSome && (
                <div>
                  <strong>{t('Deciding since')}:</strong>{' '}
                  #{formatNumber(ongoing.deciding.unwrap().since)}
                </div>
              )}
              {preimage?.proposal && (
                <Expander summary={t('Proposal')}>
                  <div className='proposal'>
                    {preimage.proposal.section}.{preimage.proposal.method}(
                    {preimage.proposal.meta?.args?.map((arg, i) => (
                      <span key={i}>{arg.name.toString()}</span>
                    )).reduce<React.ReactNode[]>((acc, curr, i) => i === 0 ? [curr] : [...acc, ', ', curr], [])}
                    )
                  </div>
                </Expander>
              )}
            </div>
          )}
        </td>
        <td />
      </StyledTr>
    </>
  );
}

const StyledTr = styled.tr`
  .shortHash {
    max-width: var(--width-shorthash);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .details {
    padding: 1rem;

    > div {
      margin-bottom: 0.5rem;
    }
  }

  .proposal {
    font-family: monospace;
    word-break: break-all;
  }
`;

export default React.memo(Referendum);
