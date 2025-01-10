// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BrokerStatus, ChainConstants, CoreDescription, PalletBrokerConfigRecord, PalletBrokerSaleInfoRecord, RegionInfo } from '@polkadot/react-hooks/types';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { BN, formatNumber } from '@polkadot/util';

import { useCoretimeContext } from '../CoretimeContext.js';
import { useTranslation } from '../translate.js';
import { estimateTime, getCurrentRegionStartEndTs } from '../utils/index.js';

interface Props {
  api: ApiPromise | null,
  coreDscriptors?: CoreDescription[];
  saleInfo: PalletBrokerSaleInfoRecord
  config: PalletBrokerConfigRecord,
  region: RegionInfo[],
  status: BrokerStatus,
  saleNumber: number,
  constants: ChainConstants
}

function Summary ({ config, constants, saleInfo, saleNumber, status }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { currentRegionEndTs, currentRegionStartTs } = getCurrentRegionStartEndTs(saleInfo, config.regionLength);
  const { get } = useCoretimeContext();
  const cycleEnd = get && estimateTime(currentRegionEndTs, get.blocks.relay(status?.lastTimeslice), constants.relay);
  const cycleStart = get && estimateTime(currentRegionStartTs, get.blocks.relay(status?.lastTimeslice), constants.relay);

  return (
    <SummaryBox>
      <section>
        {status &&
          <CardSummary label={t('sale number')}>
            <div>
              {saleNumber > -1 ? saleNumber : '-'}
            </div>
          </CardSummary>
        }
        <CardSummary label={t('sold/offered')}>
          {`${saleInfo?.coresSold} / ${saleInfo?.coresOffered}`}
        </CardSummary>
        <CardSummary label={t('sale end')}>
          <div>{cycleEnd}</div>
        </CardSummary>
        <CardSummary label={t('last block')}>
          <div>{get && formatNumber(get.blocks.relay(currentRegionEndTs))}</div>
        </CardSummary>
        <CardSummary label={t('last timeslice')}>
          <div>{formatNumber(currentRegionEndTs)}</div>
        </CardSummary>
        {config && status &&
          <CardSummary
            className='media--800'
            label={t('sale progress')}
            progress={{
              isBlurred: false,
              total: new BN(config?.regionLength),
              value: new BN(config?.regionLength - (currentRegionEndTs - status.lastTimeslice)),
              withTime: false
            }}
          />
        }
      </section>
      <section className='media--1200'>
        {status &&
          (<CardSummary label={t('current region dates')}>
            <div>
              <div style={{ fontSize: '14px' }}>{cycleStart}</div>
              <div style={{ fontSize: '14px' }}>{cycleEnd}</div>
            </div>
          </CardSummary>)
        }
        {status &&
          <CardSummary label={t('region ts')}>
            <div>
              <div style={{ fontSize: '14px' }}>{currentRegionStartTs}</div>
              <div style={{ fontSize: '14px' }}>{currentRegionEndTs}</div>
            </div>
          </CardSummary>
        }
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
