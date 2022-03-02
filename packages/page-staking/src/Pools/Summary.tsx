// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, u32 } from '@polkadot/types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_ONE, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

const maxOptions = {
  transform: (maxPools: Option<u32>) =>
    maxPools.unwrapOr(BN_ONE).toNumber()
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Summary ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const maxDelegators = useCall<number>(api.query.nominationPools.MaxDelegators, [], maxOptions);
  const maxPools = useCall<number>(api.query.nominationPools.maxPools, [], maxOptions);

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('max. pools')}>
          {formatNumber(maxPools)}
        </CardSummary>
        <CardSummary label={t<string>('max. delegators')}>
          {formatNumber(maxDelegators)}
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
