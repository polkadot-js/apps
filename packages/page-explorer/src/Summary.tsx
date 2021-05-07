// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BestFinalized, BestNumber, BlockToTime, TimeNow, TotalIssuance, FormatBalance } from '@polkadot/react-query';
import { BN_ONE } from '@polkadot/util';

import SummarySession from './SummarySession';
import { useTranslation } from './translate';

function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [ remainingSupply, setRemainingSupply ] = useState();

  async function getRemainingSupply() {
    if (api.query.stakingRewards) {
      const tb = await api.query.stakingRewards.stakingEmissionSupply();
      setRemainingSupply(tb);
    }
  }

  useEffect(() => {
    if (remainingSupply === undefined) {
      getRemainingSupply();
    }
  }, []);

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('last block')}>
          <TimeNow />
        </CardSummary>
        <CardSummary
          className='media--800'
          label={t<string>('target')}
        >
          <BlockToTime value={BN_ONE} />
        </CardSummary>
        {api.query.balances && (
          <CardSummary
            className='media--800'
            label={t<string>('total issuance')}
          >
            <TotalIssuance />
          </CardSummary>
        )}
        {remainingSupply && (
          <CardSummary
            className='media--800'
            label={t<string>('remaining emission supply')}
          >
            <FormatBalance
              value={remainingSupply}
              withSi
            />
          </CardSummary>
        )}
      </section>
      <section className='media--1200'>
        <SummarySession />
      </section>
      <section>
        {api.query.grandpa && (
          <CardSummary label={t<string>('finalized')}>
            <BestFinalized />
          </CardSummary>
        )}
        <CardSummary label={t<string>('best')}>
          <BestNumber />
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
