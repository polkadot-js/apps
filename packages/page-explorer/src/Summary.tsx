// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { BestFinalized, BestNumber, BlockToTime, TimeNow, TotalIssuance, FormatBalance } from '@polkadot/react-query';
import { BN_ONE } from '@polkadot/util';

import SummarySession from './SummarySession';
import { useTranslation } from './translate';

function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [ validatorCount, setValidatorCount ] = useState(0);
  const [ treasuryBalance, setTreasuryBalance ] = useState();
  const [ remainingSupply, setRemainingSupply ] = useState();

  async function loadValidators() {
    const validators = await api.query.poAModule.activeValidators();
    setValidatorCount(validators.length);
  }

  async function getTreasuryBalance() {
    if (api.rpc.poa) {
      const tb = await api.rpc.poa.treasuryBalance();
      setTreasuryBalance(tb);
    }
  }

  async function getRemainingSupply() {
    if (api.query.poAModule) {
      const tb = await api.query.poAModule.emissionSupply();
      setRemainingSupply(tb);
    }
  }

  if (api.query.poAModule) {
    useEffect(() => {
      if (validatorCount === 0) {
        loadValidators();
      }
      if (treasuryBalance === undefined) {
        getTreasuryBalance();
      }
      if (remainingSupply === undefined) {
        getRemainingSupply();
      }
    }, []);
  }

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
          <BlockToTime blocks={BN_ONE} />
        </CardSummary>
        {api.query.balances && (
          <CardSummary
            className='media--800'
            label={t<string>('total issuance')}
          >
            <TotalIssuance />
          </CardSummary>
        )}
        {treasuryBalance && (
          <CardSummary
            className='media--800'
            label={t<string>('treasury balance')}
          >
            <FormatBalance
              value={treasuryBalance}
              withSi
            />
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
        {api.query.poAModule && (
          <CardSummary
            className='media--800'
            label={t<string>('validators')}
          >
            {validatorCount}
          </CardSummary>
        )}
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
