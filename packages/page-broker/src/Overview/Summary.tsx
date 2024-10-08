// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { statsType } from '../types.js';
import { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { CardSummary, styled, SummaryBox, UsageBar } from '@polkadot/react-components';
import { defaultHighlight } from '@polkadot/react-components/styles';
import { useApi, useBrokerConfig, useBrokerSalesInfo, useBrokerStatus } from '@polkadot/react-hooks';
import { PalletBrokerConfigRecord, type CoreWorkload } from '@polkadot/react-hooks/types';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import { estimateTime, getStats } from '../utils.js';
import RegionLength from './Summary/RegionLength.js';
import Timeslice from './Summary/Timeslice.js';
import TimeslicePeriod from './Summary/TimeslicePeriod.js';

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const StyledSection = styled.section`
  display: flex;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 2rem
  }
`;

interface Props {
  coreCount?: string
  apiEndpoint?: LinkOption | null;
  workloadInfos?: CoreWorkload[]
}

function Summary({ coreCount, workloadInfos }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api, apiEndpoint, isApiReady } = useApi();
  const uiHighlight = apiEndpoint?.ui.color || defaultHighlight;
  const { idles, pools, tasks }: statsType = React.useMemo(() => getStats(coreCount, workloadInfos), [coreCount, workloadInfos]);

  const saleInfo = useBrokerSalesInfo(api, isApiReady);
  const config = useBrokerConfig(api, isApiReady)
  const status = useBrokerStatus(api, isApiReady)
  const currentRegionEnd = useMemo(() => saleInfo && config && saleInfo?.regionEnd - config?.regionLength, [saleInfo, config])
  return (
    <SummaryBox>
      <StyledSection style={{ display: 'flex' }}>
        {api.query.broker && (
          <>
            <StyledDiv>
              <CardSummary label={t('timeslice (ts)')}>
                <Timeslice />
              </CardSummary>
              <CardSummary label={t('block per ts')}>
                <TimeslicePeriod />
              </CardSummary>
              <CardSummary label={t('region (ts)')}>
                <RegionLength />
              </CardSummary>
              <CardSummary label={t('estimated bulk price')}>
                <div className='ui--balance-value'>
                  {formatBalance(saleInfo?.endPrice) || '-'}
                </div>
              </CardSummary>
              <CardSummary label={t('total cores')}>
                {coreCount}
              </CardSummary>
              <CardSummary label={t('cores sold/offered')}>
                <div>
                  {saleInfo?.coresSold} / {saleInfo?.coresOffered}
                </div>
              </CardSummary>
              {status && <CardSummary label={t('cycle end')}>
                <div>
                  {estimateTime(currentRegionEnd, status?.lastTimeslice * 80)}
                </div>
              </CardSummary>}
              <CardSummary
                className='media--1200'
                label={t('cycle progress')}
                progress={{
                  isBlurred: false,
                  total: new BN(config?.regionLength || 0),
                  value: config?.regionLength && new BN(config?.regionLength - (currentRegionEnd - status?.lastTimeslice)),
                  withTime: false
                }}
              />
            </StyledDiv>
          </>

        )}

        <div style={{ marginLeft: '2rem' }}>
          <UsageBar
            data={[
              { color: '#FFFFFF', label: 'Idle', value: idles },
              { color: '#04AA6D', label: 'Pools', value: pools },
              { color: uiHighlight, label: 'Tasks', value: tasks }]
            }
          ></UsageBar>

        </div>
      </StyledSection>
    </SummaryBox>
  );
}

export default React.memo(Summary);
