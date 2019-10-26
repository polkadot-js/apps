/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps, ComponentProps {}

function Summary ({ electionsInfo: { members, candidateCount, desiredSeats, termDuration, voteCount }, t }: Props): React.ReactElement<Props> {
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
      {voteCount && (
        <section>
          <CardSummary label={t('voting round')}>
            #{formatNumber(voteCount)}
          </CardSummary>
        </section>
      )}
      <section>
        <CardSummary label={t('term duration')}>
          {formatNumber(termDuration)}
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default translate(Summary);
