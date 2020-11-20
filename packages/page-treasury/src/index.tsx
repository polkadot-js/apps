// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useMembers } from '@polkadot/react-hooks';
import basicMd from './md/basic.md';
import Overview from './Overview';
// import Tips from './Tips';
import { useTranslation } from './translate';
export { default as useCounter } from './useCounter';
interface Props {
  basePath: string;
}
function TreasuryApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { isMember, members } = useMembers();
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Treasury overview')
    },
  ], [t]);
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