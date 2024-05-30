// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreWorkloadInfo } from '@polkadot/react-hooks/types';

import React from 'react';

import { CardSummary, SummaryBox, UsageBar } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Cores from './Cores.js';
import Pools from './Pools.js';
import Timeslice from './Timeslice.js';

interface Props {
  apiEndpoint?: LinkOption | null;
  workloadInfos?: CoreWorkloadInfo[] | CoreWorkloadInfo
}

function Summary ({ apiEndpoint, workloadInfos }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();

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
        <UsageBar
          apiEndpoint={apiEndpoint}
          info={workloadInfos}
        ></UsageBar>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
