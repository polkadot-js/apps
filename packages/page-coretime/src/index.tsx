// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TabItem } from '@polkadot/react-components/types';

import React, { useRef } from 'react';

import { Tabs } from '@polkadot/react-components';
import { useApi, useCoretimeInformation } from '@polkadot/react-hooks';

import Summary from './Overview/Summary.js';
import ParachainsTable from './ParachainsTable.js';
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

function CoretimeApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isApiReady } = useApi();
  const itemsRef = useRef(createItemsRef(t));
  const coretimeInfo = useCoretimeInformation(api, isApiReady);

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      {coretimeInfo && (
        <Summary
          api={isApiReady ? api : null}
          config={coretimeInfo?.config}
          parachainCount={coretimeInfo.taskIds?.length || 0}
          region={coretimeInfo?.region}
          saleInfo={coretimeInfo?.salesInfo}
          status={coretimeInfo?.status}
        />
      )}
      {!!coretimeInfo &&
        <ParachainsTable
          coretimeInfo={coretimeInfo}
        />
      }

    </main>
  );
}

export default React.memo(CoretimeApp);
