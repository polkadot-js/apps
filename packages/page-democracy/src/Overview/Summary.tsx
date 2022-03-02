// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall, useCallMulti } from '@polkadot/react-hooks';
import { BN_ONE, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  referendumCount?: number;
}

const optMulti = {
  defaultValue: [undefined, undefined] as [BN | undefined, BN | undefined]
};

function Summary ({ referendumCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const activeProposals = useCall<unknown[]>(api.derive.democracy.proposals);
  const bestNumber = useBestNumber();
  const [publicPropCount, referendumTotal] = useCallMulti<[BN | undefined, BN | undefined]>([
    api.query.democracy.publicPropCount,
    api.query.democracy.referendumCount
  ], optMulti);

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
              value: bestNumber.mod(api.consts.democracy.launchPeriod).iadd(BN_ONE),
              withTime: true
            }}
          />
        </section>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
