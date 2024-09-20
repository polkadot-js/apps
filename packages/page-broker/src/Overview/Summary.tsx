// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { CoreWorkloadType, statsType } from '../types.js';

import React from 'react';

import { CardSummary, styled, SummaryBox, UsageBar } from '@polkadot/react-components';
import { defaultHighlight } from '@polkadot/react-components/styles';
import { useApi, useBrokerStatus } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import { getStats } from '../utils.js';
import Cores from './Summary/Cores.js';
import RegionLength from './Summary/RegionLength.js';
import RenewalPrice from './Summary/RenewalPrice.js';
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
  apiEndpoint?: LinkOption | null;
  workloadInfos?: CoreWorkloadType[] | CoreWorkloadType
}

function Summary ({ workloadInfos }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api, apiEndpoint } = useApi();
  const totalCores = useBrokerStatus('coreCount');
  const uiHighlight = apiEndpoint?.ui.color || defaultHighlight;
  const { idles, pools, tasks }: statsType = React.useMemo(() => getStats(totalCores, workloadInfos), [totalCores, workloadInfos]);

  return (
    <SummaryBox>
      <StyledSection style={{ display: 'flex' }}>
        {api.query.broker && (
          <>
            <StyledDiv>
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
                <RenewalPrice />
              </CardSummary>
            </StyledDiv>
          </>

        )}
        <div style={{ marginLeft: '2rem' }}>
          <UsageBar
            data={[
              { color: '#04AA6D', label: 'Pools', value: idles },
              { color: '#FFFFFF', label: 'Idle', value: pools },
              { color: uiHighlight, label: 'Tasks', value: tasks }]
            }
          ></UsageBar>

        </div>
      </StyledSection>
    </SummaryBox>
  );
}

export default React.memo(Summary);
