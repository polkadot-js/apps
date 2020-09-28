// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BestNumber } from '@polkadot/react-query';
import { formatNumber, isNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  parachainCount?: number;
  proposalCount?: number;
  nextFreeId?: BN;
}

function Summary ({ nextFreeId, parachainCount, proposalCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('relay')}>
          {api.query.parachains
            ? t<string>('yes')
            : t<string>('no')
          }
        </CardSummary>
        {isNumber(parachainCount) && (
          <CardSummary label={t<string>('parachains')}>
            {formatNumber(parachainCount)}
          </CardSummary>
        )}
        {isNumber(proposalCount) && (
          <CardSummary label={t<string>('proposals')}>
            {formatNumber(proposalCount)}
          </CardSummary>
        )}
        {api.query.parachains && nextFreeId && (
          <CardSummary label={t<string>('next id')}>
            {formatNumber(nextFreeId)}
          </CardSummary>
        )}
      </section>
      <section>
        <CardSummary
          className='media--800'
          label={t<string>('best block')}
        >
          <BestNumber />
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default Summary;
