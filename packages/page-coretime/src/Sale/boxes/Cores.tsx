// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoretimeInformation } from '@polkadot/react-hooks/types';
import type { BlockNumber } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

import { PhaseName } from '../../constants.js';
import { useTranslation } from '../../translate.js';
import { getCorePriceAt } from '../../utils/sale.js';
import { WhiteBox } from '../../WhiteBox.js';

export const Cores = ({ phaseName, salesInfo }: { phaseName: string, salesInfo: CoretimeInformation['salesInfo'] }) => {
  const { t } = useTranslation();
  const { apiCoretime } = useApi();
  const bestNumberFinalized = useCall<BlockNumber>(apiCoretime?.derive.chain.bestNumberFinalized);
  const soldOut = useMemo(() => salesInfo.coresOffered === salesInfo.coresSold, [salesInfo.coresOffered, salesInfo.coresSold]);
  const coretimePrice = useMemo(() => bestNumberFinalized && getCorePriceAt(bestNumberFinalized.toNumber(), salesInfo), [salesInfo, bestNumberFinalized]);

  return (
    <WhiteBox>
      <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Cores</p>
      {phaseName === PhaseName.Renewals
        ? (
          <h4>{t('Cores cannot be purchased now')}</h4>
        )
        : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {soldOut && (
              <h4>{t('All cores are sold out')}</h4>
            )}
            {!soldOut && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '14px', marginBottom: '0.15rem', opacity: '0.8' }}>{t('current price')}</p>
                  <p style={{ fontSize: '20px' }}> {coretimePrice && formatBalance(coretimePrice)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', marginBottom: '0.15rem', opacity: '0.8' }}>{t('available cores')}</p>
                  <p style={{ fontSize: '20px' }}> {salesInfo.coresOffered - salesInfo.coresSold}</p>
                </div>
              </div>
            )}
          </div>
        )}

    </WhiteBox>
  );
};
