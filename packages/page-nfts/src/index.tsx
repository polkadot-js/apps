// Copyright 2017-2025 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/api-augment/substrate';

import React, { useMemo, useRef } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import AccountItems from './AccountItems/index.js';
import Overview from './Overview/index.js';
import { useTranslation } from './translate.js';
import useCollectionIds from './useCollectionIds.js';
import useCollectionInfos from './useCollectionInfos.js';

interface Props {
  basePath: string;
  className?: string;
}

function NftApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const ids = useCollectionIds();
  const infos = useCollectionInfos(ids);

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t('Overview')
    },
    {
      name: 'my-nfts',
      text: t('My NFTs')
    }
  ]);

  const hidden = useMemo(
    () => (hasAccounts && infos && infos.some(({ details, metadata }) => !!(details && metadata)))
      ? []
      : ['my-nfts'],
    [hasAccounts, infos]
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
              <AccountItems infos={infos} />
            }
            path='my-nfts'
          />
          <Route
            element={
              <Overview
                ids={ids}
                infos={infos}
              />
            }
            index
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(NftApp);
