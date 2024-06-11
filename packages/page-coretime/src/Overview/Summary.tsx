// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreDescription, OnDemandQueueStatus } from '@polkadot/react-hooks/types';

import React from 'react';

import { CardSummary, SummaryBox, UsageBar } from '@polkadot/react-components';
import { useApi, useQueueStatus } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import BrokerId from './BrokerId.js';
import QueueStatus from './QueueStatus.js';

interface Props {
  coreDscriptors?: CoreDescription[];
}

function Summary ({ coreDscriptors }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, apiEndpoint } = useApi();
  const queueStatus: OnDemandQueueStatus | undefined = useQueueStatus();

  return (
    <SummaryBox>
      <section>
        <>
          {api.query.coretimeAssignmentProvider &&
            <CardSummary label={t('broker Id')}>
              <BrokerId />
            </CardSummary>}
          {api.query.onDemandAssignmentProvider.queueStatus &&
            <>
              <CardSummary label={t('traffic multiplier')}>
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
            </>}
        </>
        <UsageBar
          apiEndpoint={apiEndpoint}
          coreDescriptors={coreDscriptors}
        />
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
