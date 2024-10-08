// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { statsType } from '../types.js';

import React from 'react';

import { CardSummary, styled, SummaryBox, UsageBar } from '@polkadot/react-components';
import { defaultHighlight } from '@polkadot/react-components/styles';
import { useApi, useBrokerSalesInfo, useBrokerStatus } from '@polkadot/react-hooks';
import { type CoreWorkload } from '@polkadot/react-hooks/types';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import { getStats } from '../utils.js';
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

function Summary ({ coreCount, workloadInfos }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api, apiEndpoint } = useApi();
  const totalCores = useBrokerStatus('coreCount');
  const uiHighlight = apiEndpoint?.ui.color || defaultHighlight;
  const { idles, pools, tasks }: statsType = React.useMemo(() => getStats(totalCores, workloadInfos), [totalCores, workloadInfos]);

  const salesInfo = useBrokerSalesInfo();

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
                  {formatBalance(salesInfo?.endPrice) || '-'}
                </div>
              </CardSummary>
              <CardSummary label={t('total cores')}>
                {coreCount}
              </CardSummary>
              <CardSummary label={t('cores sold/offered')}>
                <div>
                  {salesInfo?.coresSold} / {salesInfo?.coresOffered}
                </div>
              </CardSummary>
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
