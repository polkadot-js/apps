// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/api-augment/substrate';

import React, { useMemo, useRef } from 'react';
import { useTranslation } from './translate';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import Overview from './Overview';
import MyCollections from './MyCollections';

interface Props {
  basePath: string;
  className?: string;
}

function MultiTokensApp({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t('Overview')
    },
    {
      name: 'my-collections',
      text: t('My Collections')
    }
  ]);

  const hidden = useMemo(() => (hasAccounts ? [] : ['my-collections', 'my-tokens']), [hasAccounts]);

  return (
    <main className={className}>
      <Tabs basePath={basePath} hidden={hidden} items={tabsRef.current} />
      <Switch>
        <Route path={`${basePath}/my-collections`}>
          <MyCollections />
        </Route>
        <Route>
          <Overview />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(MultiTokensApp);
