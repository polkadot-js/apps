// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TabItem } from '@polkadot/react-components/types';

import React, { useRef } from 'react';

import { Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import Overview from './Overview/index.js';
import { BrokerProvider } from './BrokerContext.js';
import { useTranslation } from './translate.js';

interface Props {
  basePath: string;
  className?: string;
}

function createItemsRef (t: (key: string, options?: { replace: Record<string, unknown> }) => string): TabItem[] {
  return [
    {
      isRoot: true,
      name: 'overview',
      text: t('Overview')
    }
  ];
}

function BrokerApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const itemsRef = useRef(createItemsRef(t));
  const { api, isApiReady } = useApi();

  return (
    <main className={className}>
      <BrokerProvider
        api={api}
        isApiReady={isApiReady}
      >
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
        <Overview />
      </BrokerProvider>
    </main>
  );
}

export default React.memo(BrokerApp);
