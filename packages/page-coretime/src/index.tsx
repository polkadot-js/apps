// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useApi } from '@polkadot/react-hooks';

import { CoretimeProvider } from './CoretimeContext.js';
import CoretimePage from './CoretimePage.js';

interface Props {
  basePath: string;
  className?: string;
}

function CoretimeApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();

  return (
    <CoretimeProvider
      api={api}
      isApiReady={isApiReady}
    >
      <CoretimePage
        api={api}
        basePath={basePath}
        className={className}
        isApiReady={isApiReady}
      />
    </CoretimeProvider>
  );
}

export default React.memo(CoretimeApp);
