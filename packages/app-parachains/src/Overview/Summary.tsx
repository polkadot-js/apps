/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  parachains_nextFreeId?: BN;
  parachains_parachains?: BN[];
}

class Summary extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { parachains_nextFreeId, parachains_parachains = [], t } = this.props;

    return (
      <SummaryBox>
        <section>
          <CardSummary label={t('parachains')}>
            {formatNumber(parachains_parachains.length)}
          </CardSummary>
        </section>
        {parachains_nextFreeId && (
          <section>
            <CardSummary label={t('next id')}>
              {formatNumber(parachains_nextFreeId)}
            </CardSummary>
          </section>
        )}
      </SummaryBox>
    );
  }
}

export default translate(
  withCalls<Props>(
    'query.parachains.nextFreeId',
    'query.parachains.parachains'
  )(Summary)
);
