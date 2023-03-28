// Copyright 2017-2023 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/api-augment/substrate';

import type { BN } from '@polkadot/util';

import React, { useMemo, useRef } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import { BN_ONE } from '@polkadot/util';

import Balances from './Balances/index.js';
import Overview from './Overview/index.js';
import { useTranslation } from './translate.js';
import useAssetIds from './useAssetIds.js';
import useAssetInfos from './useAssetInfos.js';

interface Props {
  basePath: string;
  className?: string;
}

function findOpenId (ids?: BN[]): BN {
  if (!ids || !ids.length) {
    return BN_ONE;
  }

  const lastTaken = ids.find((id, index) =>
    index === 0
      ? !id.eq(BN_ONE)
      : !id.sub(BN_ONE).eq(ids[index - 1])
  );

  return lastTaken
    ? lastTaken.sub(BN_ONE)
    : ids[ids.length - 1].add(BN_ONE);
}

function AssetApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const ids = useAssetIds();
  const infos = useAssetInfos(ids);

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'balances',
      text: t<string>('Balances')
    }
  ]);

  const hidden = useMemo(
    () => (hasAccounts && infos && infos.some(({ details, metadata }) => !!(details && metadata)))
      ? []
      : ['balances'],
    [hasAccounts, infos]
  );

  const openId = useMemo(
    () => findOpenId(ids),
    [ids]
  );

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        hidden={hidden}
        items={tabsRef.current}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Balances infos={infos} />
            }
            path='balances'
          />
          <Route
            element={
              <Overview
                ids={ids}
                infos={infos}
                openId={openId}
              />
            }
            index
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(AssetApp);
