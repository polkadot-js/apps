// Copyright 2017-2025 @polkadot/app-staking-next authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React from 'react';

function StakingApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  return <h1>Relay Staking Page</h1>;
}

export default React.memo(StakingApp);
