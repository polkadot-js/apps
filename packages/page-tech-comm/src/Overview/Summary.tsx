// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { ComponentProps as Props } from '../types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber, isFunction } from '@polkadot/util';

import { useTranslation } from '../translate';

function Summary ({ className = '', members, proposals, type }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const proposalCount = useCall<u32>(api.query[type].proposalCount);

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('members')}>
        {formatNumber(members.length)}
      </CardSummary>
      {isFunction(api.query[type].proposalCount) && (
        <section>
          <CardSummary label={t<string>('proposals')}>
            {formatNumber(proposals?.length)}
          </CardSummary>
          <CardSummary label={t<string>('total')}>
            {formatNumber(proposalCount)}
          </CardSummary>
        </section>
      )}
    </SummaryBox>
  );
}

export default React.memo(Summary);
