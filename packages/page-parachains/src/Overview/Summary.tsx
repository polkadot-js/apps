// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { BestNumber } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  parachainCount: number;
  nextFreeId?: BN;
}

function Summary ({ nextFreeId, parachainCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('parachains')}>
          {parachainCount.toString()}
        </CardSummary>
        {nextFreeId && (
          <CardSummary label={t<string>('next id')}>
            {nextFreeId.toString()}
          </CardSummary>
        )}
      </section>
      <section>
        <CardSummary
          className='ui--media-small'
          label={t<string>('best block')}
        >
          <BestNumber withPound />
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default Summary;
