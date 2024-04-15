// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Cores from './Cores.js';
import Pools from './Pools.js';
import Timeslice from './Timeslice.js';
import BrokerId from './BrokerId.js';
import QueueStatus from './QueueStatus.js';
import useQueueStatus from '../useQueueStatus.js';

interface Props {
  relay?: boolean;
}
function Summary({ relay }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();

  if (relay) {
    const queueStatus = useQueueStatus();
    return (
      <SummaryBox>
        <section >
          {api.query.coretimeAssignmentProvider && (
            <>
              <CardSummary label={t('broker Id')}>
                <BrokerId />
              </CardSummary>
              <CardSummary label={t('traffic')}>
                <QueueStatus value={queueStatus} 
                query={'traffic'}/>
              </CardSummary>
              <CardSummary label={t('next index')}>
              <QueueStatus value={queueStatus} 
                query={'nextIndex'}/>
              </CardSummary>
            </>

          )}
        </section>
      </SummaryBox>
    );
  } else {
    return (
      <SummaryBox>
        <section >
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
