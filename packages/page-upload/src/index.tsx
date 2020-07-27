// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props, ComponentProps } from '@canvas-ui/apps/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';

import Add from './Add';
import Success from './Success';
import Upload from './Upload';

function UploadApp ({ basePath, navigateTo }: Props): React.ReactElement<Props> {
  const componentProps = useMemo(
    (): ComponentProps => ({ basePath, navigateTo }),
    [basePath, navigateTo]
  );

  return (
    <main className='upload--App'>
      <Switch>
        <Route path={`${basePath}/add`}>
          <Add {...componentProps} />
        </Route>
        <Route path={`${basePath}/success/:id`}>
          <Success {...componentProps} />
        </Route>
        <Route exact>
          <Upload {...componentProps} />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(UploadApp);
