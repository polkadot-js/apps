// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueProps, QueueStatus, QueueTx } from './types';

import React from 'react';

const defaultState: Partial<QueueProps> = {
  stqueue: [] as QueueStatus[],
  txqueue: [] as QueueTx[]
};

const StatusContext: React.Context<QueueProps> = React.createContext<QueueProps>(defaultState as QueueProps);
const QueueConsumer: React.Consumer<QueueProps> = StatusContext.Consumer;
const QueueProvider: React.Provider<QueueProps> = StatusContext.Provider;

export default StatusContext;

export {
  QueueConsumer,
  QueueProvider
};
