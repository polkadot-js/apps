// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SaleParameters } from '../types.js';

import React, { useMemo } from 'react';

import { constructSubscanQuery } from '../utils/index.js';

function formatDate (input: string) {
  const date = new Date(input + ' UTC');

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export const SubscanModuleCallUrl = ({ call = 'purchase', chainName, chosenSaleNumber, currentRegion, module = 'broker', urlTitle }: { chosenSaleNumber: number, currentRegion: SaleParameters['currentRegion'], chainName: string, urlTitle: string, module?: string, call?: string }) => {
  const url = useMemo(() => constructSubscanQuery(formatDate(currentRegion.start.date), formatDate(currentRegion.end.date), chainName, module, call), [currentRegion, chainName, module, call]);

  if (chosenSaleNumber === -1 || !currentRegion) {
    return null;
  }

  return (
    <a
      href={url}
      rel='noopener noreferrer'
      target='_blank'
    >{urlTitle}</a>
  );
};
