// Copyright 2017-2023 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

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
      text: t<string>('Overview')
    },
    isFunction((api.query.tips || api.query.treasury)?.tips) && {
      count: tipHashes?.length,
      name: 'tips',
      text: t<string>('Tips')
    }
  ].filter((t: TabItem | false): t is TabItem => !!t), [api, t, tipHashes]);

  return (
    <main className='treasury--App'>
      <Tabs
        basePath={basePath}
        items={items}
      />
      <Switch>
        <Route path={`${basePath}/tips`}>
          <Tips
            hashes={tipHashes}
            isMember={isMember}
            members={members}
          />
        </Route>
        <Route>
          <Overview
            isMember={isMember}
            members={members}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(TreasuryApp);
