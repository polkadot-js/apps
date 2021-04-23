// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import Balances from './Balances';
import Overview from './Overview';
import { useTranslation } from './translate';
import useAssetIds from './useAssetIds';
import useAssetInfos from './useAssetInfos';

interface Props {
  basePath: string;
  className?: string;
}

function GiltApp ({ basePath, className }: Props): React.ReactElement<Props> {
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
    () => (hasAccounts && infos?.length) ? [] : ['balances'],
    [hasAccounts, infos]
  );

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        hidden={hidden}
        items={tabsRef.current}
      />
      <Switch>
        <Route path={`${basePath}/balances`}>
          <Balances infos={infos} />
        </Route>
        <Route>
          <Overview
            ids={ids}
            infos={infos}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(GiltApp);
