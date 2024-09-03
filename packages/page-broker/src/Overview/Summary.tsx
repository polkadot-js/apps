// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreWorkloadInfo } from '@polkadot/react-hooks/types';
import type { statsType } from '../types.js';

import React from 'react';

import { CardSummary, SummaryBox, UsageBar } from '@polkadot/react-components';
import { defaultHighlight } from '@polkadot/react-components/styles';
import { useApi, useBrokerStatus, useCurrentPrice, useRenewalBump } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import { getStats } from '../utils.js';
import Cores from './Cores.js';
import RegionLength from './RegionLength.js';
import RenewalPrice from './RenewalPrice.js';
import Timeslice from './Timeslice.js';
import TimeslicePeriod from './TimeslicePeriod.js';

interface Props {
  apiEndpoint?: LinkOption | null;
  workloadInfos?: CoreWorkloadInfo[] | CoreWorkloadInfo
}

function Summary ({ workloadInfos }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api, apiEndpoint } = useApi();
  const renewalBump = useRenewalBump();
  const currentPrice = useCurrentPrice();
  const totalCores = useBrokerStatus('coreCount');
  const uiHighlight = apiEndpoint?.ui.color || defaultHighlight;
  const { idles, pools, tasks }: statsType = React.useMemo(() => getStats(totalCores, workloadInfos), [totalCores, workloadInfos]);

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
            <CardSummary label={t('timeslice period')}>
              <TimeslicePeriod />
            </CardSummary>
            <CardSummary label={t('region length')}>
              <RegionLength />
            </CardSummary>
            <CardSummary label={t('estimated bulk price')}>
              <RenewalPrice
                currentPrice={currentPrice}
                renewalBump={renewalBump}
              />
            </CardSummary>
          </>

        )}
        <UsageBar
          data={[
            { color: '#04AA6D', label: 'Pools', value: idles },
            { color: '#FFFFFF', label: 'Idle', value: pools },
            { color: uiHighlight, label: 'Tasks', value: tasks }]
          }
        ></UsageBar>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
