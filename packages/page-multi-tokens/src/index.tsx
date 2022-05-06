// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/api-augment/substrate';

import React, { useMemo, useRef } from 'react';
import { useTranslation } from './translate';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import Overview from './Overview';
import useCollectionIds from './useCollectionIds';

interface Props {
  basePath: string;
  className?: string;
}

function MultiTokensApp({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const ids = useCollectionIds();
  // const infos = useCollectionInfos(ids);

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'my-collections',
      text: t<string>('My Collections')
    },
    {
      name: 'my-tokens',
      text: t<string>('My Tokens')
    }
  ]);

  const hidden = useMemo(() => (hasAccounts ? [] : ['my-collections', 'my-tokens']), [hasAccounts]);

  return (
    <main className={className}>
      <Tabs basePath={basePath} hidden={hidden} items={tabsRef.current} />
      <Switch>
        {/* <Route path={`${basePath}/my-nfts`}>
          <AccountItems infos={infos} />
        </Route> */}
        <Route>
          <Overview ids={ids} />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(MultiTokensApp);
