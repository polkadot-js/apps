// Copyright 2017-2023 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/api-augment/substrate';

import React, { useMemo, useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import AccountItems from './AccountItems';
import Overview from './Overview';
import { useTranslation } from './translate.js';
import useCollectionIds from './useCollectionIds';
import useCollectionInfos from './useCollectionInfos';

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
      text: t<string>('Overview')
    },
    {
      name: 'my-nfts',
      text: t<string>('My NFTs')
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
      <Switch>
        <Route path={`${basePath}/my-nfts`}>
          <AccountItems infos={infos} />
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

export default React.memo(NftApp);
