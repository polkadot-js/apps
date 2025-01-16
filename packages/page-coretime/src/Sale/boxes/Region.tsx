// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SaleParameters } from 'page-coretime/src/types.js';

import React from 'react';

import { formatNumber } from '@polkadot/util';

import { WhiteBox } from '../../WhiteBox.js';

export const Region = ({ regionForSale }: { regionForSale: SaleParameters['regionForSale'] }) => {
  return (
    <WhiteBox style={{ justifySelf: 'center' }}>
      <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Region for sale</p>
      {regionForSale &&
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '14px', marginBottom: '0.15rem', opacity: '0.8' }}>period</p>
            <p style={{ fontSize: '20px' }}>{regionForSale.start.date} - {regionForSale.end.date}</p>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ fontSize: '14px', marginBottom: '0.15rem', opacity: '0.8' }}>relay chain blocks</p>
            <p style={{ fontSize: '20px' }}>{formatNumber(regionForSale.start.blocks)} - {formatNumber(regionForSale.end.blocks)}</p>
          </div>

        </div>}
    </WhiteBox>
  );
};
