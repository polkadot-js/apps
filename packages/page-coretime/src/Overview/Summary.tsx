// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnDemandQueueStatus } from '@polkadot/react-hooks/types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useQueueStatus } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import BrokerId from './BrokerId.js';
import Cores from './Cores.js';
import Pools from './Pools.js';
import QueueStatus from './QueueStatus.js';
import Timeslice from './Timeslice.js';

interface Props {
  relay?: boolean;
}

function Summary ({ relay }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const queueStatus: OnDemandQueueStatus | undefined = useQueueStatus();

  if (relay) {
    return (
      <SummaryBox>
        <section>
          {api.query.coretimeAssignmentProvider && (
            <>
              <CardSummary label={t('broker Id')}>
                <BrokerId />
              </CardSummary>
              <CardSummary label={t('traffic')}>
                <QueueStatus
                  query={'traffic'}
                  value={queueStatus}
                />
              </CardSummary>
              <CardSummary label={t('next index')}>
                <QueueStatus
                  query={'nextIndex'}
                  value={queueStatus}
                />
              </CardSummary>
            </>

          )}
        </section>
      </SummaryBox>
    );
  } else {
    return (
      <SummaryBox>
        <section>
          {api.query.broker && (
            <>
              <CardSummary label={t('current timeslice')}>
                <Timeslice />
              </CardSummary>
              <CardSummary label={t('core count')}>
                <Cores />
              </CardSummary>
              <CardSummary label={t('pool size')}>
                <Pools />
              </CardSummary>
            </>

          )}
        </section>
      </SummaryBox>
    );
  }
}

export default React.memo(Summary);
