// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreWorkloadInfo } from '@polkadot/react-hooks/types';

import React from 'react';

import { CardSummary, SummaryBox, UsageBar } from '@polkadot/react-components';
import { useApi, useCurrentPrice, useRenewalBump } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Cores from './Cores.js';
import RegionLength from './RegionLength.js';
import RenewalPrice from './RenewalPrice.js';
import Timeslice from './Timeslice.js';
import TimeslicePeriod from './TimeslicePeriod.js';

interface Props {
  apiEndpoint?: LinkOption | null;
  workloadInfos?: CoreWorkloadInfo[] | CoreWorkloadInfo
}

function Summary ({ apiEndpoint, workloadInfos }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const renewalBump = useRenewalBump();
  const currentPrice = useCurrentPrice();

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
          apiEndpoint={apiEndpoint}
          info={workloadInfos}
        ></UsageBar>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
