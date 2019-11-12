/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { BlockNumber } from '@polkadot/types/interfaces';
import { ComponentProps } from './types';

import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps, ComponentProps {
  bestNumber?: BlockNumber;
}

function Summary ({ bestNumber, electionsInfo: { members, candidateCount, desiredSeats, runnersUp, termDuration, voteCount }, t }: Props): React.ReactElement<Props> {
  return (
    <SummaryBox>
      <section>
        <CardSummary label={t('seats')}>
          {formatNumber(members.length)}/{formatNumber(desiredSeats)}
        </CardSummary>
        <CardSummary label={t('runners up')}>
          {formatNumber(runnersUp.length)}
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
      {bestNumber && termDuration && termDuration.gtn(0) && (
        <section>
          <CardSummary
            label={t('term progress')}
            progress={{
              total: termDuration,
              value: bestNumber.mod(termDuration)
            }}
          />
        </section>
      )}
    </SummaryBox>
  );
}

export default translate(Summary);
