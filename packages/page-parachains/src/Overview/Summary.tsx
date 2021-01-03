// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BestNumber } from '@polkadot/react-query';
import { formatNumber, isNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  parachainCount?: number;
  upcomingCount?: number;
}

function Summary ({ parachainCount, upcomingCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('relay')}>
          {api.query.paras
            ? t<string>('yes')
            : t<string>('no')
          }
        </CardSummary>
        {isNumber(parachainCount) && (
          <CardSummary label={t<string>('parachains')}>
            {formatNumber(parachainCount)}
          </CardSummary>
        )}
        {isNumber(upcomingCount) && (
          <CardSummary label={t<string>('upcoming')}>
            {formatNumber(upcomingCount)}
          </CardSummary>
        )}
      </section>
      <section>
        <CardSummary
          className='media--800'
          label={t<string>('best block')}
        >
          <BestNumber />
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default Summary;
