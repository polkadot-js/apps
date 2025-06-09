// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Tabs } from '@polkadot/react-components';

import CommandCenter from '../CommandCenter/index.js';
import { useTranslation } from '../translate.js';

function StakingApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'command-center',
      text: t('Command Center')
    }], [t]);

  return <>
    <Tabs
      basePath={basePath}
      items={items}
    />
    <Routes>
      <Route path={basePath}>
        <Route
          element={<CommandCenter />}
          index
        />
      </Route>
    </Routes>
  </>;
}

export default React.memo(StakingApp);
