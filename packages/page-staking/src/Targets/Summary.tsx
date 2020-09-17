// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  avgStaked?: BN;
  lowStaked?: BN;
  lastReward?: BN;
  numNominators?: number;
  numValidators?: number;
  totalStaked?: BN;
}

function Summary ({ avgStaked, lastReward, lowStaked, numNominators, numValidators, totalStaked }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const totalIssuance = useCall<Balance>(api.query.balances?.totalIssuance);

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
        {totalIssuance && (
          <CardSummary
            label={`${totalStaked?.gtn(0) ? `${t<string>('total staked')} / ` : ''}${t<string>('total issuance')}`}
            progress={progressStake}
          >
            <div>
              {totalStaked?.gtn(0) && (
                <>
                  <FormatBalance
                    value={totalStaked}
                    withCurrency={false}
                    withSi
                  />
                  &nbsp;/&nbsp;
                </>
              )}
              <FormatBalance
                value={totalIssuance}
                withSi
              />
            </div>
          </CardSummary>
        )}
      </section>
      {avgStaked && lowStaked && (
        <CardSummary
          className='media--1000'
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
      {numValidators && numNominators && (
        <CardSummary
          className='media--1600'
          label={`${t<string>('nominators')} / ${t<string>('validators')}`}
        >
          {numNominators}&nbsp;/&nbsp;{numValidators}
        </CardSummary>
      )}
      {lastReward?.gtn(0) && (
        <CardSummary label={t<string>('last reward')}>
          <FormatBalance
            value={lastReward}
            withSi
          />
        </CardSummary>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
