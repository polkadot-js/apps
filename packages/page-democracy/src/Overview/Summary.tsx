// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  referendumCount?: number;
}

function Summary ({ referendumCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const activeProposals = useCall<unknown[]>(api.derive.democracy.proposals);
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  const publicPropCount = useCall<BN>(api.query.democracy.publicPropCount);
  const referendumTotal = useCall<BN>(api.query.democracy.referendumCount);

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('proposals')}>
          {formatNumber(activeProposals?.length)}
        </CardSummary>
        <CardSummary label={t<string>('total')}>
          {formatNumber(publicPropCount)}
        </CardSummary>
      </section>
      <section>
        <CardSummary label={t<string>('referenda')}>
          {formatNumber(referendumCount || 0)}
        </CardSummary>
        <CardSummary label={t<string>('total')}>
          {formatNumber(referendumTotal || 0)}
        </CardSummary>
      </section>
      {bestNumber && (
        <section className='media--1100'>
          <CardSummary
            label={t<string>('launch period')}
            progress={{
              total: api.consts.democracy.launchPeriod,
              value: bestNumber.mod(api.consts.democracy.launchPeriod).addn(1),
              withTime: true
            }}
          />
        </section>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
