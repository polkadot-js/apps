// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveParachainInfo } from '@polkadot/api-derive/types';

import React, { useMemo, useRef } from 'react';
import { matchPath, Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import { Tabs } from '@polkadot/react-components';
import { useApi, useSudo } from '@polkadot/react-hooks';

import Overview from './Overview';
import Parachain from './Parachain';
import { useTranslation } from './translate';
import { parachainName } from './util';

interface Props {
  basePath: string;
}

function ParachainsApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
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
        {api.query.parachains && (
          <Route path={`${basePath}/:id`}>
            <Parachain
              basePath={basePath}
              paraInfoRef={paraInfoRef}
              {...sudoState}
            />
          </Route>
        )}
        <Route>
          <Overview {...sudoState} />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(ParachainsApp);
