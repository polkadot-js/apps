// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachainFull, DeriveParachainInfo } from '@polkadot/api-derive/types';
import { AppProps, BareProps } from '@polkadot/react-components/types';

import React, { useMemo, useRef } from 'react';
import { matchPath, Route, Switch } from 'react-router';
import { useLocation, useParams } from 'react-router-dom';
import { Tabs } from '@polkadot/react-components';
import { useApi, useCall, useSudo } from '@polkadot/react-hooks';

import Overview from './Overview';
import Parachain from './Parachain';
import { useTranslation } from './translate';
import { parachainName } from './util';

interface Props extends AppProps, BareProps {}

export default function ParachainsApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const location = useLocation();
  const match = matchPath<{ id: string }>(location.pathname, { path: `${basePath}/:id` });
  // console.log(params, 'asdf');
  // const paraInfoRef = useRef<DeriveParachainInfo | null>(null);
  const sudoState = useSudo();
  const paraInfoRef = useRef<DeriveParachainInfo | null>(null);
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t('Parachains overview')
    },
    ...(
      match?.params.id
        ? [{
          name: match.params.id,
          text: `${match.params.id}: ${parachainName(t, paraInfoRef.current)}`
        }]
        : []
    )
  ], [location, paraInfoRef.current, t]);

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
