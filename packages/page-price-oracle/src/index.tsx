// Copyright 2017-2026 @polkadot/app-price-oracle authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Tabs } from '@polkadot/react-components';

import PriceOracle from './PriceOracle.js';
import { useTranslation } from './translate.js';

export { default as useCounter } from './useCounter.js';

interface Props {
  basePath: string;
  className?: string;
}

function PriceOracleApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'index',
      text: t('Overview')
    }
  ]);

  return (
    <main className={`${className} priceOracle--App`}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <PriceOracle />
    </main>
  );
}

export default React.memo(PriceOracleApp);
