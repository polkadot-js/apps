// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BestNumber } from '@polkadot/react-query';
import { formatNumber, isNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  parachainCount?: number;
  nextFreeId?: BN;
}

function Summary ({ nextFreeId, parachainCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('relay')}>
          {api.query.parachains
            ? t<string>('yes')
            : t<string>('no')
          }
        </CardSummary>
        {isNumber(parachainCount) && (
          <CardSummary label={t<string>('parachains')}>
            {formatNumber(parachainCount)}
          </CardSummary>
        )}
        {api.query.parachains && nextFreeId && (
          <CardSummary label={t<string>('next id')}>
            {formatNumber(nextFreeId)}
          </CardSummary>
        )}
      </section>
      <section>
        <CardSummary
          className='ui--media-small'
          label={t<string>('best block')}
        >
          <BestNumber />
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default Summary;
