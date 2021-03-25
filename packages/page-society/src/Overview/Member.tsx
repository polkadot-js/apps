// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Balance, BlockNumber } from '@polkadot/types/interfaces';
import type { MapMember } from '../types';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { AddressSmall, Columar, Expander, Tag, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import DesignKusama from './DesignKusama';

interface Props {
  bestNumber?: BN;
  className?: string;
  value: MapMember;
}

function renderJSXPayouts (bestNumber: BN, payouts: [BlockNumber, Balance][]): JSX.Element[] {
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

  const isMember = useMemo(
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
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={accountId} />
      </td>
      <td className='all'>
        {isHead && (
          <Tag
            color='green'
            label={t<string>('society head')}
          />
        )}
        {isFounder && (
          <Tag
            color='green'
            label={t<string>('founder')}
          />
        )}
        {isSkeptic && (
          <Tag
            color='yellow'
            label={t<string>('skeptic')}
          />
        )}
        {(isCandidateVoter || isDefenderVoter) && (
          <Tag
            color='blue'
            label={t<string>('voted')}
          />
        )}
        {isWarned && (
          <Tag
            color='orange'
            label={t<string>('strikes')}
          />
        )}
        {isSuspended && (
          <Tag
            color='red'
            label={t<string>('suspended')}
          />
        )}
        {availablePayout && (
          <Tag
            color='grey'
            label={t<string>('payout')}
          />
        )}
      </td>
      <td className='number together'>
        {!!payouts?.length && (
          <Expander
            className='payoutExpander'
            renderChildren={renderPayouts}
            summary={t<string>('Payouts ({{count}})', { replace: { count: formatNumber(payouts.length) } })}
          />
        )}
      </td>
      <td className='together'>{votedOn}</td>
      <td className='number'>{formatNumber(strikes)}</td>
      <td className='button start'>
        <DesignKusama accountId={accountId} />
        {availablePayout && (
          <TxButton
            accountId={accountId}
            icon='ellipsis-h'
            isDisabled={!isMember}
            label='Payout'
            params={[]}
            tx={api.tx.society.payout}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(styled(Member)`
  .payoutExpander {
    .payout+.payout {
      margin-top: 0.5rem;
    }

    .ui--Columnar {
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
`);
