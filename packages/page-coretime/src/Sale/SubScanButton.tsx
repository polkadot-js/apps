// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SaleParameters } from '../types.js';

import React, { useCallback } from 'react';

import { Button } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import { constructSubscanQuery } from '../utils/index.js';

export const SubScanButton = ({ chainName, chosenSaleNumber, currentRegion }: { chosenSaleNumber: number, currentRegion: SaleParameters['currentRegion'], chainName: string }) => {
  const { t } = useTranslation();
  const onQuerySaleClick = useCallback(() => {
    if (currentRegion) {
      window.open(constructSubscanQuery(currentRegion.start.blocks.coretime, currentRegion.end.blocks.coretime, chainName));
    }
  }, [currentRegion, chainName]);

  if (chosenSaleNumber === -1 || !currentRegion) {
    return null;
  }

  return (
    <Button
      isBasic
      label={t(`Query Subscan for sale #${chosenSaleNumber + 1} transactions`)}
      onClick={onQuerySaleClick}
    />
  );
};
