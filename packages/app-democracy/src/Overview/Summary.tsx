/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, trackStream } from '@polkadot/react-hooks';
import { withCalls } from '@polkadot/react-api';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  chain_bestNumber?: BN;
  democracy_nextTally?: BN;
  democracy_publicPropCount?: BN;
  democracy_referendumCount?: BN;
}

function Summary (props: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const activeProposals = trackStream<any[]>(api.derive.democracy.proposals, []);

  const {
    chain_bestNumber,
    democracy_nextTally = new BN(0),
    democracy_publicPropCount,
    democracy_referendumCount = new BN(0),
    t
  } = props;

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t('proposals')}>
          {formatNumber(activeProposals?.length)}
        </CardSummary>
        <CardSummary label={t('total')}>
          {formatNumber(democracy_publicPropCount)}
        </CardSummary>
      </section>
      <section>
        <CardSummary label={t('referenda')}>
          {formatNumber(democracy_referendumCount.sub(democracy_nextTally))}
        </CardSummary>
        <CardSummary label={t('total')}>
          {formatNumber(democracy_referendumCount)}
        </CardSummary>
      </section>
      {chain_bestNumber && (
        <section className='ui--media-medium'>
          <CardSummary
            label={t('launch period')}
            progress={{
              value: chain_bestNumber.mod(api.consts.democracy.launchPeriod).addn(1),
              total: api.consts.democracy.launchPeriod
            }}
          />
        </section>
      )}
    </SummaryBox>
  );
}

export default translate(
  withCalls<Props>(
    'query.democracy.nextTally',
    'query.democracy.publicPropCount',
    'query.democracy.referendumCount',
    'derive.chain.bestNumber'
  )(Summary)
);
