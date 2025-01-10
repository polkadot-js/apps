// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SaleParameters } from 'page-coretime/src/types.js';

import React from 'react';

import { formatNumber } from '@polkadot/util';

import { WhiteBox } from '../../WhiteBox.js';

export const Region = ({ regionForSale }: { regionForSale: SaleParameters['regionForSale'] }) => {
  return (
    <WhiteBox>
      <p style={{ fontSize: '14px', opacity: '0.8' }}>Region for sale</p>
      {regionForSale &&
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>
                    <p style={{ fontSize: '14px', marginBottom: '0.25rem' }}>date period</p>
                    <p style={{ fontSize: '20px' }}>{regionForSale.start.date} - {regionForSale.end.date}</p>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <p style={{ marginBottom: '0.25rem' }}>relay chain blocks</p>
                    <p>{formatNumber(regionForSale.start.blocks)} - {formatNumber(regionForSale.end.blocks)}</p>
                  </div>

                </div>}
    </WhiteBox>
  );
};
