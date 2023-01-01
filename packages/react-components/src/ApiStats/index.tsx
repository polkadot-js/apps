// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import ApiStatsContext, { ApiStatsProvider } from './Context';
import useApiStats from './useApiStats';

export { ApiStatsContext };

interface Props {
  children?: React.ReactNode;
}

export default function ApiStats ({ children }: Props): React.ReactElement<Props> {
  const stats = useApiStats();

  return (
    <ApiStatsProvider value={stats}>
      {children}
    </ApiStatsProvider>
  );
}
