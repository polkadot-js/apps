// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@canvas-ui/apps/types';
import { ComponentProps } from './types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { WithLoader } from '@canvas-ui/react-components';
import { useAccounts, useContracts } from '@canvas-ui/react-hooks';
import { classes } from '@canvas-ui/react-util';

import Add from './Add';
import Call from './Call';
import Contracts from './Contracts';

function ExecuteApp ({ basePath, className, navigateTo }: Props): React.ReactElement<Props> {
  const { allAccounts, isReady: isAccountsReady } = useAccounts();
  const { allContracts, hasContracts, isContract, isReady: isContractsReady } = useContracts();

  const componentProps = useMemo(
    (): ComponentProps => ({
      accounts: allAccounts,
      basePath,
      contracts: allContracts,
      hasContracts,
      isContract,
      navigateTo
    }),
    [allAccounts, allContracts, basePath, hasContracts, isContract, navigateTo]
  );
  const isLoading = useMemo(
    (): boolean => !isContractsReady || !isAccountsReady,
    [isAccountsReady, isContractsReady]
  );

  return (
    <main className={classes(className, 'execute--App', isLoading && 'isLoading')}>
      <WithLoader isLoading={isLoading}>
        <Switch>
          <Route path={`${basePath}/add`}>
            <Add {...componentProps} />
          </Route>
          <Route path={`${basePath}/:address/:messageIndex?`}>
            <Call {...componentProps} />
          </Route>
          <Route exact>
            <Contracts {...componentProps} />
          </Route>
        </Switch>
      </WithLoader>
    </main>
  );
}

export default React.memo(ExecuteApp);
