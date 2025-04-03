// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BrokerStatus, CoreDescription, PalletBrokerConfigRecord, PalletBrokerSaleInfoRecord, RegionInfo } from '@polkadot/react-hooks/types';
import type { RelayName } from '../types.js';

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { BN } from '@polkadot/util';

import { useCoretimeContext } from '../CoretimeContext.js';
import { useTranslation } from '../translate.js';
import { FirstCycleStart } from '../utils/index.js';

interface Props {
  coreDscriptors?: CoreDescription[];
  saleInfo: PalletBrokerSaleInfoRecord
  config: PalletBrokerConfigRecord,
  region: RegionInfo[],
  status: BrokerStatus,
  parachainCount: number
  relayName: RelayName,
}

function Summary ({ config, parachainCount, relayName, status }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { coretimeInfo, currentRegionEnd, currentRegionStart, saleEndDate, saleStartDate } = useCoretimeContext();

  const saleNumber = useMemo(() => {
    if (relayName && currentRegionEnd) {
      return Math.floor(
        (currentRegionEnd - FirstCycleStart.timeslice.coretime[relayName]) / config.regionLength
      );
    }

    return undefined;
  }, [currentRegionEnd, relayName, config]);

  const timeslicesSinceCycleStart = useMemo(() => currentRegionEnd && new BN(config?.regionLength).sub((new BN(currentRegionEnd)).sub(new BN(status.lastTimeslice))), [status, config, currentRegionEnd]);

  return (
    <SummaryBox>
      <section>
        {status &&
          <CardSummary label={t('sale number')}>
            <div>
              {saleNumber}
            </div>
          </CardSummary>
        }
        <CardSummary label={t('timeslice')}>
          {status?.lastTimeslice}
        </CardSummary>
        <CardSummary label={t('parachains')}>
          {parachainCount && parachainCount}
        </CardSummary>
        {config && status && currentRegionEnd && saleEndDate && saleStartDate && timeslicesSinceCycleStart && coretimeInfo?.constants &&
          <>
            <CardSummary
              className='media--800'
              label={t('timeslice progress')}
              progress={{
                hideGraph: true,
                hideValue: false,
                isBlurred: false,
                total: new BN(config?.regionLength),
                value: timeslicesSinceCycleStart,
                withTime: false
              }}
            />
            <CardSummary
              label={t('cycle')}
              progress={{
                total: new BN(config.regionLength).mul(new BN(coretimeInfo?.constants.relay.blocksPerTimeslice)),
                value: timeslicesSinceCycleStart.mul(new BN(coretimeInfo?.constants.relay.blocksPerTimeslice)),
                withTime: true
              }}
            />
          </>

        }
      </section>
      <section className='media--1200'>
        <CardSummary label={t('sale dates')}>
          <div>
            <div style={{ fontSize: '14px' }}>{saleStartDate}</div>
            <div style={{ fontSize: '14px' }}>{saleEndDate}</div>
          </div>
        </CardSummary>
        <CardSummary label={t('sale ts')}>
          <div>
            <div style={{ fontSize: '14px' }}>{currentRegionStart}</div>
            <div style={{ fontSize: '14px' }}>{currentRegionEnd}</div>
          </div>
        </CardSummary>

      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
