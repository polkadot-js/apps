// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { ComponentProps as Props } from '../types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

<<<<<<< HEAD
function Summary({ className = '', members, proposalHashes, type }: Props): React.ReactElement<Props> {
=======
function Summary({ className = '', members, proposals }: Props): React.ReactElement<Props> {
>>>>>>> ternoa-master
  const { t } = useTranslation();
  const { api } = useApi();
  const proposalCount = useCall<u32>(api.query.rootCommittee.proposalCount);

  return (
    <SummaryBox className={className}>
      <CardSummary label={t<string>('members')}>
        {formatNumber(members.length)}
      </CardSummary>
<<<<<<< HEAD
      {proposalCount && (
        <section>
          <CardSummary label={t<string>('proposals')}>
            {formatNumber(proposalHashes?.length)}
          </CardSummary>
          <CardSummary label={t<string>('total')}>
            {formatNumber(proposalCount)}
          </CardSummary>
        </section>
      )}
=======
      <section>
        <CardSummary label={t<string>('proposals')}>
          {formatNumber(proposals?.length)}
        </CardSummary>
        <CardSummary label={t<string>('total')}>
          {formatNumber(proposalCount)}
        </CardSummary>
      </section>
>>>>>>> ternoa-master
    </SummaryBox>
  );
}

export default React.memo(Summary);
