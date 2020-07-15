// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachainInfo } from '@polkadot/api-derive/types';

import React, { useMemo, useRef } from 'react';
import { matchPath, Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import { Tabs } from '@polkadot/react-components';
import { useSudo } from '@polkadot/react-hooks';

import Overview from './Overview';
import Parachain from './Parachain';
import { useTranslation } from './translate';
import { parachainName } from './util';

interface Props {
  basePath: string;
}

function ParachainsApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const sudoState = useSudo();
  const paraInfoRef = useRef<DeriveParachainInfo | null>(null);

  const location = useLocation();
  const match = matchPath<{ id: string }>(location.pathname, { path: `${basePath}/:id` });
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Parachains overview')
    },
    ...(
      match && match.params.id
        ? [{
          name: match.params.id,
          text: `${match.params.id}: ${parachainName(t, paraInfoRef.current)}`
        }]
        : []
    )
  ], [match, t]);

  return (
    <main>
      <header>
        <Tabs
          basePath={basePath}
          isSequence
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/:id`}>
          <Parachain
            basePath={basePath}
            paraInfoRef={paraInfoRef}
            {...sudoState}
          />
        </Route>
        <Route>
          <Overview {...sudoState} />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(ParachainsApp);
