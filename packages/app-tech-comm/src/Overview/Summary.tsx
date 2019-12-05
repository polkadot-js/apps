/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from '../types';

import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useStream } from '@polkadot/react-hooks';
import { u32 } from '@polkadot/types';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends ComponentProps, I18nProps {}

function Summary ({ className, members, proposals, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const proposalCount = useStream<u32>(api.query.technicalCommittee.proposalCount, []);

  return (
    <SummaryBox className={className}>
      <CardSummary label={t('members')}>
        {formatNumber(members?.length)}
      </CardSummary>
      <section>
        <CardSummary label={t('proposals')}>
          {formatNumber(proposals?.length)}
        </CardSummary>
        <CardSummary label={t('total')}>
          {formatNumber(proposalCount)}
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default translate(Summary);
