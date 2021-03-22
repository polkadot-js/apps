// Copyright 2017-2021 @polkadot/apps authors & contributors
// and @canvas-ui/app authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi, useAppNavigation, useHasInstantiateWithCode } from '@canvas-ui/react-hooks';
import React from 'react';
import { Redirect } from 'react-router';

function NotFound (): React.ReactElement {
  const { pathTo } = useAppNavigation();
  const hasInstantiateWithCode = useHasInstantiateWithCode();

  return <Redirect to={hasInstantiateWithCode ? pathTo.instantiate : pathTo.upload} />;
}

export default React.memo(NotFound);
