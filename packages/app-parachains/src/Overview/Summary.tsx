// Copyright 2017-2019 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { withCalls } from '@polkadot/react-api';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  nextFreeId?: BN;
  parachains?: BN[];
}

function Summary ({ nextFreeId, parachains = [], t }: Props): React.ReactElement<Props> {
  return (
    <SummaryBox>
      <section>
        <CardSummary label={t('parachains')}>
          {formatNumber(parachains.length)}
        </CardSummary>
      </section>
      {nextFreeId && (
        <section>
          <CardSummary label={t('next id')}>
            {formatNumber(nextFreeId)}
          </CardSummary>
        </section>
      )}
    </SummaryBox>
  );
}

export default translate(
  withCalls<Props>(
    ['query.registrar.nextFreeId', {
      fallbacks: ['query.parachains.nextFreeId'],
      propName: 'nextFreeId'
    }],
    ['query.registrar.parachains', {
      fallbacks: ['query.parachains.parachains'],
      propName: 'parachains'
    }]
  )(Summary)
);
