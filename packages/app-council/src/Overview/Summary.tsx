/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from './types';

import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/ui-app';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps, ComponentProps {}

class Summary extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { electionsInfo, t } = this.props;
    const { members, candidateCount, desiredSeats, termDuration, voteCount } = electionsInfo;

    return (
      <SummaryBox>
        <section>
          <CardSummary label={t('seats')}>
            {formatNumber(Object.keys(members).length)}/{formatNumber(desiredSeats)}
          </CardSummary>
          <CardSummary label={t('candidates')}>
            {formatNumber(candidateCount)}
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t('voting round')}>
            #{formatNumber(voteCount)}
          </CardSummary>
        </section>

        <section>
          <CardSummary label={t('term duration')}>
            {formatNumber(termDuration)}
          </CardSummary>
        </section>
      </SummaryBox>
    );
  }
}

export default translate(Summary);
