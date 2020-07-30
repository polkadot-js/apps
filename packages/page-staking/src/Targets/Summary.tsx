// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  lastReward?: BN;
  numNominators?: number;
  numValidators?: number;
  totalStaked?: BN;
}

interface Progress {
  hideValue: true;
  total: BN;
  value: BN;
}

function Summary ({ lastReward, numNominators, numValidators, totalStaked }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const totalIssuance = useCall<Balance>(api.query.balances?.totalIssuance, []);
  const [progressStake, setProgressStake] = useState<Progress | undefined>();

  useEffect((): void => {
    totalIssuance && totalStaked && totalStaked.gtn(0) && setProgressStake({
      hideValue: true,
      total: totalIssuance,
      value: totalStaked
    });
  }, [totalIssuance, totalStaked]);

  return (
    <SummaryBox>
      <section className='ui--media-small'>
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
      {numValidators && numNominators && (
        <CardSummary label={`${t<string>('validators')} / ${t<string>('nominators')}`}>
          {numValidators}&nbsp;/&nbsp;{numNominators}
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
