// Copyright 2017-2021 @polkadot/apps authors & contributors
// and @canvas-ui/app authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi, useAppNavigation } from '@canvas-ui/react-hooks';
import React from 'react';
import { Redirect } from 'react-router';

function NotFound (): React.ReactElement {
  const { api } = useApi();
  const { pathTo } = useAppNavigation();
  const hasPutCode = !api.tx.contracts.putCode;

  return <Redirect to={hasPutCode ? pathTo.upload : pathTo.instantiate} />;
}

export default React.memo(NotFound);
