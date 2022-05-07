// Copyright 2017-2022 @polkadot/app-utilities authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Convert from './Convert';
import Hash from './Hash';
import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
}

function UtilitiesApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'convert',
      text: t<string>('Convert address')
    },
    {
      name: 'hash',
      text: t<string>('Hash data')
    }
  ]);

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        items={tabsRef.current}
      />
      <Switch>
        <Route path={`${basePath}/hash`}>
          <Hash />
        </Route>
        <Route>
          <Convert />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(UtilitiesApp);
