// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionIndexes } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { Balance } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ONE, BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  avgStaked?: BN;
  lowStaked?: BN;
  minNominated?: BN;
  minNominatorBond?: BN;
  numNominators?: number;
  numValidators?: number;
  stakedReturn: number;
  totalIssuance?: BN;
  totalStaked?: BN;
}

const transformReward = {
  transform: (optBalance: Option<Balance>) => optBalance.unwrapOrDefault()
};

const transformEra = {
  transform: ({ activeEra }: DeriveSessionIndexes) => activeEra.gt(BN_ZERO) ? activeEra.sub(BN_ONE) : undefined
};

function Summary ({ avgStaked, lowStaked, minNominated, minNominatorBond, stakedReturn, totalIssuance, totalStaked }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const lastEra = useCall<BN | undefined>(api.derive.session.indexes, undefined, transformEra);
  const lastReward = useCall<BN>(lastEra && api.query.staking.erasValidatorReward, [lastEra], transformReward);

  const progressStake = useMemo(
    () => totalIssuance && totalStaked && totalStaked.gtn(0)
      ? {
        hideValue: true,
        total: totalIssuance,
        value: totalStaked
      }
      : undefined,
    [totalIssuance, totalStaked]
  );

  const progressAvg = useMemo(
    () => avgStaked && lowStaked && avgStaked.gtn(0)
      ? {
        hideValue: true,
        total: avgStaked,
        value: lowStaked
      }
      : undefined,
    [avgStaked, lowStaked]
  );

  return (
    <SummaryBox>
      <section className='media--800'>
        {totalIssuance && totalStaked?.gt(BN_ZERO) && (
          <CardSummary
            label={t<string>('total staked')}
            progress={progressStake}
          >
            <FormatBalance
              value={totalStaked}
              withSi
            />
          </CardSummary>
        )}
      </section>
      <section className='media--800'>
        {totalIssuance && (stakedReturn > 0) && Number.isFinite(stakedReturn) && (
          <CardSummary label={t<string>('returns')}>
            {stakedReturn.toFixed(1)}%
          </CardSummary>
        )}
      </section>
      <section className='media--1000'>
        {avgStaked?.gtn(0) && lowStaked?.gtn(0) && (
          <CardSummary
            label={`${t<string>('lowest / avg staked')}`}
            progress={progressAvg}
          >
            <FormatBalance
              value={lowStaked}
              withCurrency={false}
              withSi
            />
            &nbsp;/&nbsp;
            <FormatBalance
              value={avgStaked}
              withSi
            />
          </CardSummary>
        )}
      </section>
      <section className='media--1600'>
        {minNominated?.gt(BN_ZERO) && (
          <CardSummary
            className='media--1600'
            label={
              minNominatorBond
                ? t<string>('min nominated / threshold')
                : t<string>('min nominated')}
          >
            <FormatBalance
              value={minNominated}
              withCurrency={!minNominatorBond}
              withSi
            />
            {minNominatorBond && (
              <>
                &nbsp;/&nbsp;
                <FormatBalance
                  value={minNominatorBond}
                  withSi
                />
              </>
            )}
          </CardSummary>
        )}
      </section>
      <section>
        {lastReward?.gtn(0) && (
          <CardSummary label={t<string>('last reward')}>
            <FormatBalance
              value={lastReward}
              withSi
            />
          </CardSummary>
        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
