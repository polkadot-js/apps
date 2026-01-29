// Copyright 2017-2025 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  trigger: number;
}

function Summary ({ trigger }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const accountCounter = useCall<BN>(api.query.contracts.accountCounter);
  const [numContracts, setNumContracts] = useState(0);
  const [numHashes, setNumHashes] = useState(0);

  useEffect((): void => {
    accountCounter && api.query.contracts.contractInfoOf
      .keys()
      .then((arr) => setNumContracts(arr.length))
      .catch(console.error);
  }, [api, accountCounter]);

  useEffect((): void => {
    (api.query.contracts.pristineCode || api.query.contracts.codeStorage)
      .keys()
      .then((arr) => setNumHashes(arr.length))
      .catch(console.error);
  }, [api, trigger]);

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t('addresses')}>
          {formatNumber(accountCounter)}
        </CardSummary>
      </section>
      <section>
        <CardSummary label={t('code hashes')}>
          {formatNumber(numHashes)}
        </CardSummary>
        <CardSummary label={t('contracts')}>
          {formatNumber(numContracts)}
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
