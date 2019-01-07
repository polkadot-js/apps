// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { CardSummary } from '@polkadot/ui-app/index';
import { BestFinalised, BestNumber, TimeNow, TimePeriod } from '@polkadot/ui-react-rx/index';

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
        <section>
          <CardSummary
            label={t('summary.period', {
              defaultValue: 'target time'
            })}
          >
            <TimePeriod />
          </CardSummary>
          <CardSummary
            label={t('summary.now', {
              defaultValue: 'last block'
            })}
          >
            <TimeNow />
          </CardSummary>
        </section>
        <section>
          <SummarySession />
        </section>
        <section>
          <CardSummary
            label={t('summary.finalised', {
              defaultValue: 'finalised'
            })}
          >
            <BestFinalised />
          </CardSummary>
          <CardSummary
            label={t('summary.best', {
              defaultValue: 'best'
            })}
          >
            <BestNumber />
          </CardSummary>
        </section>
      </summary>
    );
  }
}

export default translate(Summary);
