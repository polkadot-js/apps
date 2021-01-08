import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';
import type { u32 } from '@polkadot/types';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import type { ComponentProps } from './types';

function SimpleSummary ({ className = '', members }: ComponentProps): React.ReactElement<ComponentProps> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const proposalCount = useCall<u32>(api.query.council.proposalCount);

  return (
    <SummaryBox className={className}>
      <section>
        <CardSummary label={t<string>('members')}>
          {formatNumber(members.length)}
        </CardSummary>
      </section>
      <section>
        <CardSummary label={t<string>('total proposals')}>
          {formatNumber(proposalCount)}
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(SimpleSummary);
