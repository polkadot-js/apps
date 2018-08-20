// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import CardBar from '@polkadot/ui-app/CardBar';
import CardSummary from '@polkadot/ui-app/CardSummary';
import BestNumber from '@polkadot/ui-react-rx/BestNumber';
import TimePeriod from '@polkadot/ui-react-rx/TimePeriod';
import TimeNow from '@polkadot/ui-react-rx/TimeNow';

import Query from './Query';
import SummarySession from './SummarySession';
import translate from './translate';

type Props = I18nProps & {};

class Summary extends React.PureComponent<Props> {
  render () {
    const { className, style, t } = this.props;

    return (
      <CardBar
        className={className}
        expanded={
          <Query />
        }
        style={style}
      >
        <div className='column'>
          <CardSummary label={t('summary.period', {
            defaultValue: 'target time'
          })}>
            <TimePeriod />
          </CardSummary>
          <CardSummary label={t('summary.now', {
            defaultValue: 'last block'
          })}>
            <TimeNow />
          </CardSummary>
        </div>
        <div className='column'>
          <SummarySession />
        </div>
        <div className='column'>
          <CardSummary label={t('summary.best', {
            defaultValue: 'best'
          })}>
            <BestNumber />
          </CardSummary>
        </div>
      </CardBar>
    );
  }
}

export default translate(Summary);
