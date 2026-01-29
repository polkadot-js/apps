// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SaleParameters } from 'page-coretime/src/types.js';

import React from 'react';

import { styled } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import { WhiteBox } from '../../WhiteBox.js';

const RegionWrapper = styled(WhiteBox)`
  justify-self: center;

  @media (min-width: 1150px) {
    width: 100%;
  }
`;

export const Region = ({ regionForSale }: { regionForSale: SaleParameters['regionForSale'] }) => {
  const { t } = useTranslation();

  return (
    <RegionWrapper>
      <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{t('Region for sale')}</p>
      {regionForSale &&
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '14px', marginBottom: '0.15rem', opacity: '0.8' }}>period</p>
            <p style={{ fontSize: '20px' }}>{regionForSale.start.date} - {regionForSale.end.date}</p>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ fontSize: '14px', marginBottom: '0.15rem', opacity: '0.8' }}>{t('relay chain blocks')}</p>
            <p style={{ fontSize: '20px' }}>{formatNumber(regionForSale.start.blocks.relay)} - {formatNumber(regionForSale.end.blocks.relay)}</p>
          </div>

        </div>}
    </RegionWrapper>
  );
};
