// Copyright 2017-2025 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { Route, Routes } from 'react-router';
import { useLocation } from 'react-router-dom';

import { Tabs } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Motions from './Motions/index.js';
import Overview from './Overview/index.js';
import { useTranslation } from './translate.js';
import useCounter from './useCounter.js';

export { useCounter };

interface Props {
  basePath: string;
  className?: string;
}

function CouncilApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { pathname } = useLocation();
  const numMotions = useCounter();
  const prime = useCall<AccountId | null>(api.derive.council.prime);
  const motions = useCall<DeriveCollectiveProposal[]>(api.derive.council.proposals);

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t('Overview')
    },
    {
      count: numMotions,
      name: 'motions',
      text: t('Motions')
    }
  ], [numMotions, t]);

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={items}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Motions
                motions={motions}
                prime={prime}
              />
            }
            path='motions'
          />
        </Route>
      </Routes>
      <Overview
        className={[basePath, `${basePath}/candidates`].includes(pathname) ? '' : '--hidden'}
        prime={prime}
      />
    </main>
  );
}

export default React.memo(CouncilApp);
