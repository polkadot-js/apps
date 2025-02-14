// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BrokerStatus, ChainConstants, CoreDescription, PalletBrokerConfigRecord, PalletBrokerSaleInfoRecord, RegionInfo } from '@polkadot/react-hooks/types';
import type { RelayName } from '../types.js';

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import Countdown from '@polkadot/react-components/Countdown';
import { BN } from '@polkadot/util';

import { useCoretimeContext } from '../CoretimeContext.js';
import { useTranslation } from '../translate.js';
import { estimateTime, FirstCycleStart } from '../utils/index.js';

interface Props {
  coreDscriptors?: CoreDescription[];
  saleInfo: PalletBrokerSaleInfoRecord
  config: PalletBrokerConfigRecord,
  region: RegionInfo[],
  status: BrokerStatus,
  parachainCount: number
  relayName: RelayName,
  constants: ChainConstants
}

function Summary ({ config, constants, parachainCount, relayName, saleInfo, status }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const currentRegionEnd = saleInfo.regionEnd - config.regionLength;
  const currentRegionStart = saleInfo.regionEnd - config.regionLength * 2;
  const { get } = useCoretimeContext();

  const saleStartDate = useMemo(() => {
    return get && estimateTime(currentRegionStart, get.blocks.relay(status?.lastTimeslice), constants.relay);
  }, [currentRegionStart, status?.lastTimeslice, constants.relay, get]);

  const saleEndDate = useMemo(() => {
    return get && estimateTime(currentRegionEnd, get.blocks.relay(status?.lastTimeslice), constants.relay);
  }, [currentRegionEnd, status?.lastTimeslice, constants.relay, get]);

  const saleNumber = useMemo(() => {
    if (relayName && currentRegionEnd) {
      return Math.floor(
        (currentRegionEnd - FirstCycleStart.timeslice.coretime[relayName]) / config.regionLength
      );
    }

    return undefined;
  }, [currentRegionEnd, relayName, config]);

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
        {config && status &&
          <>
            <CardSummary
              className='media--800'
              label={t('cycle time left')}
              progress={{
                hideGraph: true,
                hideValue: true,
                isBlurred: false,
                total: new BN(config?.regionLength),
                value: new BN(config?.regionLength - (currentRegionEnd - status.lastTimeslice)),
                withTime: false
              }}
            >
              <Countdown
                current={new Date()}
                end={new Date(saleEndDate)}
                start={new Date(saleStartDate)}
              />
            </CardSummary>
            <CardSummary
              className='media--800'
              label={t('timeslice progress')}
              progress={{
                hideValue: false,
                isBlurred: false,
                total: new BN(config?.regionLength),
                value: new BN(config?.regionLength - (currentRegionEnd - status.lastTimeslice)),
                withTime: false
              }}
            />
          </>

        }
      </section>
      <section className='media--1200'>
        {status &&
          (<CardSummary label={t('sale dates')}>
            <div>
              <div style={{ fontSize: '14px' }}>{saleStartDate}</div>
              <div style={{ fontSize: '14px' }}>{saleEndDate}</div>
            </div>
          </CardSummary>)
        }
        {status &&
          <CardSummary label={t('sale ts')}>
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
