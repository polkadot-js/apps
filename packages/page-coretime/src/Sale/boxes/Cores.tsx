// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoretimeInformation } from '@polkadot/react-hooks/types';
import type { BlockNumber } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { styled } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { PhaseName } from '../../constants.js';
import { useTranslation } from '../../translate.js';
import { formatBNToBalance, getCorePriceAt } from '../../utils/sale.js';
import { WhiteBox } from '../../WhiteBox.js';

export const Cores = ({ color, phaseName, salesInfo }: { phaseName: string, salesInfo: CoretimeInformation['salesInfo'], color: string }) => {
  const { t } = useTranslation();
  const { apiCoretime } = useApi();
  const bestNumberFinalized = useCall<BlockNumber>(apiCoretime?.derive.chain.bestNumberFinalized);
  const coretimePrice = useMemo(() => bestNumberFinalized && salesInfo && getCorePriceAt(bestNumberFinalized.toNumber(), salesInfo), [salesInfo, bestNumberFinalized]);

  const formattedCoretimePrice = useMemo(() => {
    return !coretimePrice ? null : formatBNToBalance(coretimePrice);
  }, [coretimePrice]);

  const CoresWrapper = styled(WhiteBox)`
    justify-self: flex-end;

    @media (max-width: 1150px) {
      width: 100%;
    }
  `;

  return (
    <CoresWrapper>
      <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Cores</p>
      {phaseName === PhaseName.Renewals
        ? (
          <h4>{t('Cores cannot be purchased now')}</h4>
        )
        : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '14px', marginBottom: '0.15rem', opacity: '0.8' }}>{t('current price')}</p>
                  <p style={{ color: `${color}`, fontSize: '20px' }}>{formattedCoretimePrice}</p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', marginBottom: '0.15rem', opacity: '0.8' }}>{t('available cores')}</p>
                  <p style={{ fontSize: '20px' }}> {salesInfo.coresOffered - salesInfo.coresSold}</p>
                </div>
              </div>
            }
          </div>
        )}

    </CoresWrapper>
  );
};
