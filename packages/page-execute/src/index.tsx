// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from './types';

import React from 'react';
// import React, { useCallback, useMemo } from 'react';
// import { Route, Switch } from 'react-router';
// import { useHistory } from 'react-router-dom';

function ExecuteApp ({ basePath }: Props): React.ReactElement<Props> {
  // const history = useHistory();
  // const navigateToDeploy = useCallback(
  //   (): void => history.push(`${basePath}/execute`),
  //   []
  // )
  // const componentProps = useMemo(
  //   (): ComponentProps => ({ basePath, navigateToExecute }),
  //   [basePath, navigateToExecute]
  // );

  return (
    <main className='execute--App'>
      {/* <Switch>
        <Route path={`${basePath}/add`}>
          <Add {...componentProps} />
        </Route>
        <Route exact>
          <Codes {...componentProps} />
        </Route>
      </Switch> */}
    </main>
  );
}

export default React.memo(ExecuteApp);
