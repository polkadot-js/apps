// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BrokerStatus, CoreDescription, PalletBrokerConfigRecord, PalletBrokerSaleInfoRecord, RegionInfo } from '@polkadot/react-hooks/types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { BN } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import { estimateTime } from '../utils.js';

interface Props {
  coreDscriptors?: CoreDescription[];
  saleInfo: any
  config: PalletBrokerConfigRecord,
  region: RegionInfo,
  status: BrokerStatus,
  parachainCount: number
}

function Summary({ config, parachainCount, region, saleInfo, status }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const currentRegionEnd = saleInfo.regionEnd - config.regionLength;

  return (
    <SummaryBox>
      <section>
        <>
          <CardSummary label={t('timeslice')}>
            {status?.lastTimeslice}
          </CardSummary>
          <CardSummary label={t('cores sold')}>
            {`${saleInfo?.coresSold} / ${saleInfo?.coresOffered}`}
          </CardSummary>
        </>
        {/* <CardSummary label={t('current lease')}>
          {leasePeriod
            ? formatNumber(leasePeriod.currentPeriod)
            : <span className='--tmp'>99</span>}
        </CardSummary> */}
        <CardSummary label={t('parachains')}>
          {parachainCount && parachainCount}
        </CardSummary>
        {status && <CardSummary label={t('cycle end')}>
          <div>
            {estimateTime(currentRegionEnd, status?.lastTimeslice * 80)}
          </div>
        </CardSummary>}
        {config && status && <CardSummary
          className='media--1200'
          label={t('cycle progress')}
          progress={{
            isBlurred: false,
            total: new BN(config?.regionLength),
            value: new BN(config?.regionLength - (currentRegionEnd - status.lastTimeslice)),
            withTime: false
          }}
        />}
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
