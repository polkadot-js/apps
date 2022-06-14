// Copyright 2017-2022 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useApi, useCollectiveMembers } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import basicMd from './md/basic.md';
import Overview from './Overview';
import Tips from './Tips';
import { useTranslation } from './translate';
import useTipHashes from './useTipHashes';

export { default as useCounter } from './useCounter';

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
      <HelpOverlay md={basicMd as string} />
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
