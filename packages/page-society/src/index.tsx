// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';

import Overview from './Overview';
import { useTranslation } from './translate';

interface Props extends AppProps, BareProps {}

function SocietyApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t('Society overview')
    }
  ], [t]);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          items={items}
        />
      </header>
      <Switch>
        <Route component={Overview} />
      </Switch>
    </main>
  );
}

export default React.memo(SocietyApp);
