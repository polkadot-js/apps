// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps as Props } from '@canvas-ui/apps/types';
import { ComponentProps } from './types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import useCodes from '@canvas-ui/apps/useCodes';

import Codes from './Codes';
import New from './New';
import Success from './Success';

function DeployApp ({ basePath, navigateTo }: Props): React.ReactElement<Props> {
  const { allCodes, hasCodes, updated } = useCodes();

  const componentProps = useMemo(
    (): ComponentProps => ({
      allCodes,
      basePath,
      hasCodes,
      navigateTo,
      updated
    }),
    [allCodes, basePath, hasCodes, navigateTo, updated]
  );

  return (
    <main className='deploy--App'>
      <Switch>
        <Route path={`${basePath}/new/:id?/:index?`}>
          <New {...componentProps} />
        </Route>
        <Route path={`${basePath}/success/:address`}>
          <Success {...componentProps} />
        </Route>
        <Route exact>
          <Codes {...componentProps} />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(DeployApp);
