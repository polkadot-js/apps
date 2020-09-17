// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useApi, useIncrement, useIsMountedRef, useMembers } from '@polkadot/react-hooks';

import basicMd from './md/basic.md';
import Overview from './Overview';
import Tips from './Tips';

import { useTranslation } from './translate';

export { default as useCounter } from './useCounter';

interface Props {
  basePath: string;
}

function TreasuryApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [tipHashTrigger, triggerTipHashes] = useIncrement();
  const { isMember, members } = useMembers();
  const [tipHashes, setTipHashes] = useState<string[] | null>(null);

  useEffect((): void => {
    if (tipHashTrigger && mountedRef.current) {
      api.query.treasury.tips.keys().then((keys) =>
        mountedRef.current && setTipHashes(
          keys.map((key) => key.args[0].toHex())
        )
      ).catch(console.error);
    }
  }, [api, tipHashTrigger, mountedRef]);

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Treasury overview')
    },
    {
      count: tipHashes?.length,
      name: 'tips',
      text: t<string>('Tips')
    }
  ], [t, tipHashes]);

  return (
    <main className='treasury--App'>
      <HelpOverlay md={basicMd as string} />
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/tips`}>
          <Tips
            hashes={tipHashes}
            isMember={isMember}
            members={members}
            trigger={triggerTipHashes}
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
