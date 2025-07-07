// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { AppProps } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Tabs } from '@polkadot/react-components';

import CommandCenter from '../CommandCenter/index.js';
import { useTranslation } from '../translate.js';

interface Props extends AppProps {
  ahApi?: ApiPromise
  rcApi?: ApiPromise
  isRelayChain: boolean
  rcEndPoints: string[]
  ahEndPoints: string[]
}

function StakingApp ({ ahApi, ahEndPoints, basePath, isRelayChain, rcApi, rcEndPoints }: Props): React.ReactElement<Props> {
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
          element={
            <CommandCenter
              ahApi={ahApi}
              ahEndPoints={ahEndPoints}
              isRelayChain={isRelayChain}
              rcApi={rcApi}
              rcEndPoints={rcEndPoints}
            />
          }
          index
        />
      </Route>
    </Routes>
  </>;
}

export default React.memo(StakingApp);
