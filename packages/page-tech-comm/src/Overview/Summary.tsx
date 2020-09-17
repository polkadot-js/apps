// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as Props } from '../types';

import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { u32 } from '@polkadot/types';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

function Summary ({ className = '', members, proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const proposalCount = useCall<u32>(api.query.technicalCommittee.proposalCount);

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('members')}>
        {formatNumber(members.length)}
      </CardSummary>
      <section>
        <CardSummary label={t<string>('proposals')}>
          {formatNumber(proposals?.length)}
        </CardSummary>
        <CardSummary label={t<string>('total')}>
          {formatNumber(proposalCount)}
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
