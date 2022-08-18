// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Stats } from './types';

import React from 'react';

const ApiStatsContext: React.Context<Stats[]> = React.createContext<Stats[]>([]);
const ApiStatsConsumer: React.Consumer<Stats[]> = ApiStatsContext.Consumer;
const ApiStatsProvider: React.Provider<Stats[]> = ApiStatsContext.Provider;

export default ApiStatsContext;

export {
  ApiStatsConsumer,
  ApiStatsProvider
};
