// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { CardSummary } from '@polkadot/ui-app/index';
import { BestFinalised, BestNumber, TimeNow, TimePeriod } from '@polkadot/ui-reactive/index';

import SummarySession from './SummarySession';
import translate from './translate';

type Props = I18nProps & {};

class Summary extends React.PureComponent<Props> {
  render () {
    const { className, style, t } = this.props;

    return (
      <summary
        className={className}
        style={style}
      >
        <section className='ui--media-small'>
          <CardSummary label={t('target')}>
            <TimePeriod />
          </CardSummary>
          <CardSummary label={t('last block')}>
            <TimeNow />
          </CardSummary>
        </section>
        <section className='ui--media-large'>
          <SummarySession />
        </section>
        <section>
          <CardSummary label={t('finalised')}>
            <BestFinalised />
          </CardSummary>
          <CardSummary label={t('best')}>
            <BestNumber />
          </CardSummary>
        </section>
      </summary>
    );
  }
}

export default translate(Summary);
