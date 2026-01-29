// Copyright 2017-2025 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Route, Routes } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useApi, useCollectiveMembers } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import Overview from './Overview/index.js';
import Tips from './Tips/index.js';
import { useTranslation } from './translate.js';
import useTipHashes from './useTipHashes.js';

export { default as useCounter } from './useCounter.js';

interface Props {
  basePath: string;
}

interface TabItem {
  count?: number;
  isRoot?: boolean;
  name: string;
  text: string;
}

function TreasuryApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isMember, members } = useCollectiveMembers('council');
  const tipHashes = useTipHashes();

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t('Overview')
    },
    isFunction((api.query.tips || api.query.treasury)?.tips) && {
      count: tipHashes?.length,
      name: 'tips',
      text: t('Tips')
    }
  ].filter((t: TabItem | false): t is TabItem => !!t), [api, t, tipHashes]);

  return (
    <main className='treasury--App'>
      <Tabs
        basePath={basePath}
        items={items}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Tips
                hashes={tipHashes}
                isMember={isMember}
                members={members}
              />
            }
            path='tips'
          />
          <Route
            element={
              <Overview
                isMember={isMember}
                members={members}
              />
            }
            index
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(TreasuryApp);
