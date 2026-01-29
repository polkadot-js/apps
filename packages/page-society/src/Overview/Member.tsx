// Copyright 2017-2025 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Balance, BlockNumber } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { MapMember } from '../types.js';

import React, { useCallback, useMemo } from 'react';

import { AddressSmall, Columar, Expander, styled, Tag, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import DesignKusama from './DesignKusama.js';

interface Props {
  bestNumber?: BN;
  className?: string;
  value: MapMember;
}

function renderJSXPayouts (bestNumber: BN, payouts: [BlockNumber, Balance][]): React.ReactElement<unknown>[] {
  return payouts.map(([bn, value], index) => (
    <div
      className='payout'
      key={index}
    >
      <Columar>
        <Columar.Column>
          <FormatBalance value={value} />
        </Columar.Column>
        <Columar.Column>
          <div>#{formatNumber(bn)}</div>
          {bn.gt(bestNumber) && (
            <BlockToTime
              key={index}
              value={bn.sub(bestNumber)}
            />
          )}
        </Columar.Column>
      </Columar>
    </div>
  ));
}

function Member ({ bestNumber, className = '', value: { accountId, isCandidateVoter, isDefenderVoter, isFounder, isHead, isSkeptic, isSuspended, isWarned, key, payouts, strikes } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();

  const renderPayouts = useCallback(
    () => bestNumber && payouts && renderJSXPayouts(bestNumber, payouts),
    [bestNumber, payouts]
  );

  const isOwner = useMemo(
    () => allAccounts.some((a) => a === key),
    [allAccounts, key]
  );

  const availablePayout = useMemo(
    () => bestNumber && payouts.find(([b]) => bestNumber.gt(b)),
    [bestNumber, payouts]
  );

  const votedOn = useMemo(
    () => [isCandidateVoter && t('Candidate'), isDefenderVoter && t('Defender')]
      .filter((s): s is string => !!s)
      .join(', '),
    [isCandidateVoter, isDefenderVoter, t]
  );

  return (
    <StyledTr className={className}>
      <td className='address relative all'>
        <AddressSmall value={accountId} />
        <div className='absolute'>
          {(isCandidateVoter || isDefenderVoter) && (
            <Tag
              color='blue'
              label={t('voted')}
            />
          )}
          {isWarned && (
            <Tag
              color='orange'
              label={t('strikes')}
            />
          )}
          {isHead && (
            <Tag
              color='green'
              label={t('society head')}
            />
          )}
          {isFounder && (
            <Tag
              color='green'
              label={t('founder')}
            />
          )}
          {isSkeptic && (
            <Tag
              color='yellow'
              label={t('skeptic')}
            />
          )}
          {isSuspended && (
            <Tag
              color='red'
              label={t('suspended')}
            />
          )}
          {availablePayout && (
            <Tag
              color='grey'
              label={t('payout')}
            />
          )}
        </div>
      </td>
      <td className='number together'>
        {!!payouts?.length && (
          <Expander
            className='payoutExpander'
            renderChildren={renderPayouts}
            summary={t('Payouts ({{count}})', { replace: { count: formatNumber(payouts.length) } })}
          />
        )}
        {isOwner && availablePayout && (
          <TxButton
            accountId={accountId}
            icon='ellipsis-h'
            label='Payout'
            params={[]}
            tx={api.tx.society.payout}
          />
        )}
      </td>
      <td className='together'>{votedOn}</td>
      <td className='number'>{formatNumber(strikes)}</td>
      <td className='button start'>
        <DesignKusama accountId={accountId} />
      </td>
    </StyledTr>
  );
}

const StyledTr = styled.tr`
  .payoutExpander {
    .payout+.payout {
      margin-top: 0.5rem;
    }

    .ui--Columar {
      flex-wrap: unset;

      .ui--Column {
        min-width: 15ch;

        &:first-child {
          max-width: 100% !important;
        }

        &:last-child {
          min-width: 15ch;
          max-width: 15ch;
          white-space: nowrap;
        }
      }
    }
  }
`;

export default React.memo(Member);
