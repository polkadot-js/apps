// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u32 } from '@polkadot/types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

const maxOptions = {
  transform: (maxPools: Option<u32>) =>
    maxPools.unwrapOr(BN_ZERO).toNumber()
};

function Summary ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();

  // FIXME use a multi query (or derive) for these
  const maxDelegators = useCall<number>(api.query.nominationPools.maxDelegators, [], maxOptions);
  const maxDelegatorsPool = useCall<number>(api.query.nominationPools.naxDelegatorsPerPool, [], maxOptions);
  const maxPools = useCall<number>(api.query.nominationPools.maxPools, [], maxOptions);

  return (
    <SummaryBox className={className}>
      <section>
        {maxDelegators && (
          <CardSummary label={t<string>('max. pools')}>
            {formatNumber(maxPools)}
          </CardSummary>
        )}
        {maxDelegatorsPool && (
          <CardSummary label={t<string>('max. delegators')}>
            {formatNumber(maxDelegators)}
          </CardSummary>
        )}
        {maxPools && (
          <CardSummary label={t<string>('max. delegators / pool')}>
            {formatNumber(maxDelegatorsPool)}
          </CardSummary>
        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
