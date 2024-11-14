// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BrokerStatus, CoreDescription, PalletBrokerConfigRecord, PalletBrokerSaleInfoRecord, RegionInfo } from '@polkadot/react-hooks/types';

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useCall } from '@polkadot/react-hooks';
import { BN } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import { estimateTime, FirstCycleStart } from '../utils.js';

interface Props {
  api: ApiPromise | null,
  coreDscriptors?: CoreDescription[];
  saleInfo: PalletBrokerSaleInfoRecord
  config: PalletBrokerConfigRecord,
  region: RegionInfo[],
  status: BrokerStatus,
}

function Summary ({ api, config, saleInfo, status }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const currentRegionEnd = saleInfo.regionEnd - config.regionLength;
  const currentRegionStart = saleInfo.regionEnd - config.regionLength * 2;
  const chainName = useCall<string>(api?.rpc.system.chain)?.toString().toLowerCase();

  const cycleNumber = useMemo(() =>
    chainName && currentRegionEnd && Math.floor((currentRegionEnd - FirstCycleStart[chainName]) / config.regionLength)
  , [currentRegionEnd, chainName, config]);

  return (
    <SummaryBox>
      <section>
        {status &&
          <CardSummary label={t('sale number')}>
            <div>
              {cycleNumber}
            </div>
          </CardSummary>
        }
        <CardSummary label={t('sold/offered')}>
          {`${saleInfo?.coresSold} / ${saleInfo?.coresOffered}`}
        </CardSummary>
        <CardSummary label={t('sale end')}>
          <div>{estimateTime(currentRegionEnd, status?.lastTimeslice * 80)}</div>
        </CardSummary>
        <CardSummary label={t('last block')}>
          <div>{currentRegionEnd * 80}</div>
        </CardSummary>
        <CardSummary label={t('last timeslice')}>
          <div>{currentRegionEnd}</div>
        </CardSummary>
        {config && status &&
          <CardSummary
            className='media--800'
            label={t('sale progress')}
            progress={{
              isBlurred: false,
              total: new BN(config?.regionLength),
              value: new BN(config?.regionLength - (currentRegionEnd - status.lastTimeslice)),
              withTime: false
            }}
          />
        }
      </section>
      <section className='media--1200'>
        {status &&
          (<CardSummary label={t('cycle dates')}>
            <div>
              <div style={{ fontSize: '14px' }}>{estimateTime(currentRegionStart, status?.lastTimeslice * 80)}</div>
              <div style={{ fontSize: '14px' }}>{estimateTime(currentRegionEnd, status?.lastTimeslice * 80)}</div>
            </div>
          </CardSummary>)
        }
        {status &&
          <CardSummary label={t('cycle ts')}>
            <div>
              <div style={{ fontSize: '14px' }}>{currentRegionStart}</div>
              <div style={{ fontSize: '14px' }}>{currentRegionEnd}</div>
            </div>
          </CardSummary>
        }
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);