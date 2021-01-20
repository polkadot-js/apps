// Copyright 2017-2021 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps as Props } from '@canvas-ui/apps/types';
import useCodes from '@canvas-ui/apps/useCodes';
import { WithLoader } from '@canvas-ui/react-components';
import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import Codes from './Codes';
import New from './New';
import Success from './Success';
import { ComponentProps } from './types';

function DeployApp ({ basePath, navigateTo }: Props): React.ReactElement<Props> {
  const { allCodes, hasCodes, isLoading, updated } = useCodes();

  const componentProps = useMemo(
    (): ComponentProps => ({
      allCodes,
      basePath,
      hasCodes,
      isLoading,
      navigateTo,
      updated
    }),
    [allCodes, basePath, hasCodes, isLoading, navigateTo, updated]
  );

  return (
    <main className='deploy--App'>
      <WithLoader isLoading={isLoading}>
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
      </WithLoader>
    </main>
  );
}

export default React.memo(DeployApp);
