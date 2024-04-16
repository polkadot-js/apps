// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OnDemandQueueStatus } from '@polkadot/react-hooks/types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useQueueStatus } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import BrokerId from './BrokerId.js';
import QueueStatus from './QueueStatus.js';

function Summary (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const queueStatus: OnDemandQueueStatus | undefined = useQueueStatus();

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
}

export default React.memo(Summary);
