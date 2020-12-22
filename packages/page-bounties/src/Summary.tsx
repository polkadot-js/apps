// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useTranslation } from '@polkadot/app-treasury/translate';
import { CardSummary, SummaryBox } from '@polkadot/react-components';

interface Props {
  activeBounties?: number;
}

function Summary ({ activeBounties }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t<string>('active')}>
          {activeBounties}
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
