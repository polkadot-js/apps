// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useHistory } from 'react-router-dom';
import store from '@polkadot/apps/store';

import Codes from './Codes';
import New from './New'

function DeployApp ({ basePath, navigateTo }: Props): React.ReactElement<Props> {
  const [updated, setUpdated] = useState(0);
  const [allCodes, setAllCodes] = useState(store.getAllCode());

  const _triggerUpdate = useCallback(
    (): void => {
      setUpdated(Date.now());
      setAllCodes(store.getAllCode());
    },
    []
  );

  const componentProps = useMemo(
    (): ComponentProps => ({
      allCodes,
      basePath,
      hasCodes: allCodes?.length > 0,
      navigateTo,
      updated
    }),
    [allCodes, navigateTo, basePath, updated]
  );

  // const componentProps = useMemo(
  //   (): ComponentProps => ({ allCodes: basePath, ...appNavigation }),
  //   [basePath, appNavigation]
  // );

  useEffect(
    (): void => {
      store.on('new-code', _triggerUpdate);
      store.on('removed-code', _triggerUpdate);

      store.loadAll()
        .then((): void => setAllCodes(store.getAllCode()))
        .catch((): void => {
          // noop, handled internally
        });
    },
    []
  );

  return (
    <main className='deploy--App'>
      <Switch>
        <Route path={`${basePath}/new/:id?/:index?`}>
          <New {...componentProps} />
        </Route>
        <Route exact>
          <Codes {...componentProps} />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(DeployApp);
