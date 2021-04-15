// Copyright 2017-2021 @canvas-ui/app-instantiate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { WithLoader } from '@canvas-ui/react-components';
import { AppProps as Props } from '@canvas-ui/react-components/types';
import { useHasInstantiateWithCode } from '@canvas-ui/react-hooks';
import useCodes from '@canvas-ui/react-store/useCodes';
import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import Add from './Add';
import Codes from './Codes';
import New from './New';
import NewFromCode from './NewFromCode';
import Success from './Success';
import { ComponentProps } from './types';

function InstantiateApp ({ basePath }: Props): React.ReactElement<Props> {
  const { allCodes, hasCodes, isLoading, updated } = useCodes();
  const hasInstantiateWithCode = useHasInstantiateWithCode();

  const componentProps = useMemo(
    (): ComponentProps => ({
      allCodes,
      basePath,
      hasCodes,
      isLoading,
      updated
    }),
    [allCodes, basePath, hasCodes, isLoading, updated]
  );

  return (
    <main className='instantiate--App'>
      <WithLoader isLoading={isLoading}>
        <Switch>
          <Route path={`${basePath}/new/:id/:index?`}>
            <New {...componentProps} />
          </Route>
          {hasInstantiateWithCode && (
            <Route path={`${basePath}/new`}>
              <NewFromCode {...componentProps} />
            </Route>
          )}
          <Route path={`${basePath}/add`}>
            <Add {...componentProps} />
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

export default React.memo(InstantiateApp);
