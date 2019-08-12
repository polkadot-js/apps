// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { BestFinalized, BestNumber, TimeNow, TimePeriod, TotalIssuance } from '@polkadot/react-query';

import SummarySession from './SummarySession';
import translate from './translate';

type Props = I18nProps;

class Summary extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { t } = this.props;

    return (
      <SummaryBox>
        <section>
          <CardSummary label={t('last block')}>
            <TimeNow />
          </CardSummary>
          <CardSummary
            className='ui--media-small'
            label={t('target')}
          >
            <TimePeriod />
          </CardSummary>
          <CardSummary
            className='ui--media-small'
            label={t('total issuance')}
          >
            <TotalIssuance />
          </CardSummary>
        </section>
        <section className='ui--media-large'>
          <SummarySession />
        </section>
        <section>
          <CardSummary label={t('finalized')}>
            <BestFinalized />
          </CardSummary>
          <CardSummary label={t('best')}>
            <BestNumber />
          </CardSummary>
        </section>
      </SummaryBox>
    );
  }
}

export default translate(Summary);
