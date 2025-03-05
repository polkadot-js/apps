// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { statsType } from '../types.js';

import React from 'react';

import { CardSummary, styled, SummaryBox, UsageBar } from '@polkadot/react-components';
import { defaultHighlight } from '@polkadot/react-components/styles';
import { useApi } from '@polkadot/react-hooks';
import { type CoreWorkload } from '@polkadot/react-hooks/types';
import { BN, BN_ZERO } from '@polkadot/util';

import { useBrokerContext } from '../BrokerContext.js';
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
  apiEndpoint?: LinkOption | null;
  coreCount?: string
  workloadInfos?: CoreWorkload[]
}

function Summary ({ coreCount, workloadInfos }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api, apiEndpoint } = useApi();
  const uiHighlight = apiEndpoint?.ui.color || defaultHighlight;
  const { idles, pools, tasks }: statsType = React.useMemo(() => getStats(coreCount, workloadInfos), [coreCount, workloadInfos]);
  const { config, currentRegion, saleInfo, status } = useBrokerContext();

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
              <CardSummary label={t('total cores')}>
                {coreCount}
              </CardSummary>
              <CardSummary label={t('cores sold/offered')}>
                <div>
                  {saleInfo?.coresSold} / {saleInfo?.coresOffered}
                </div>
              </CardSummary>
              <CardSummary
                label={t('cycle progress')}
                progress={{
                  isBlurred: false,
                  total: new BN(config?.regionLength || 0),
                  value: (config?.regionLength && currentRegion.end && status && new BN(config?.regionLength - (currentRegion.end - status?.lastTimeslice))) || BN_ZERO,
                  withTime: false
                }}
              />
            </StyledDiv>
          </>

        )}
        <div
          className='media--1400'
          style={{ marginLeft: '2rem' }}
        >
          <UsageBar
            data={[
              { color: '#FFFFFF', label: 'Idle', value: idles },
              { color: '#04AA6D', label: 'Pools', value: pools },
              { color: uiHighlight, label: 'Tasks', value: tasks }]
            }
          ></UsageBar>

        </div>
      </StyledSection>
      <section>
        {currentRegion.begin && currentRegion.end &&
          (
            <>
              <CardSummary
                className='media--1200'
                label={t('sale dates')}
              >
                <div>
                  <div style={{ fontSize: '14px' }}>{currentRegion.beginDate}</div>
                  <div style={{ fontSize: '14px' }}>{currentRegion.endDate}</div>
                </div>
              </CardSummary>
              <CardSummary
                className='media--1200'
                label={t('sale ts')}
              >
                <div>
                  <div style={{ fontSize: '14px' }}>{currentRegion.begin}</div>
                  <div style={{ fontSize: '14px' }}>{currentRegion.end}</div>
                </div>
              </CardSummary>
            </>
          )
        }
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
