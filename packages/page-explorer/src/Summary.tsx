// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { bnToBn } from '@polkadot/util';
import { BestFinalized, BestNumber, BlockToTime, TimeNow, TotalIssuance } from '@polkadot/react-query';
import { BN_ONE, formatNumber } from '@polkadot/util';

import SummarySession from './SummarySession';
import { useTranslation } from './translate';

interface Props {
  eventCount: number;
}

function Summary ({ eventCount }: Props): React.ReactElement {
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
  }, [api, remainingSupply]);

  let totalPosRewards;

  // If its the PoS mainnet, show PoS rewards given so far
  if (remainingSupply && (api.genesisHash.toHex() === '0x6bfe24dca2a3be10f22212678ac13a6446ec764103c0f3471c71609eac384aae')) {
    // By the end of PoA, remaining emission supply was 144981701016200
    totalPosRewards = bnToBn(144981701016200).sub(remainingSupply);
  }

  return (
    <SummaryBox>
      <section>
        {api.query.timestamp && (
          <>
            <CardSummary label={t<string>('last block')}>
              <TimeNow />
            </CardSummary>
            <CardSummary
              className='media--800'
              label={t<string>('target')}
            >
              <BlockToTime value={BN_ONE} />
            </CardSummary>
          </>
        )}
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
        {totalPosRewards && (
          <CardSummary
            className='media--800'
            help={t<string>('Emission rewards generated during PoS so far')}
            label={t<string>('pos rewards')}
          >
            <FormatBalance
              value={totalPosRewards}
              withSi
            />
          </CardSummary>
        )}
      </section>
      <section className='media--1200'>
        <SummarySession />
      </section>
      <section>
        <CardSummary
          className='media--1000'
          label={t<string>('last events')}
        >
          {formatNumber(eventCount)}
        </CardSummary>
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
