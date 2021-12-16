// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueProps, QueueStatus, QueueTx } from './types';

import React from 'react';

const defaultState: Partial<QueueProps> = {
  stqueue: [] as QueueStatus[],
  txqueue: [] as QueueTx[]
};

export const StatusContext: React.Context<QueueProps> = React.createContext<QueueProps>(defaultState as QueueProps);
export const QueueConsumer: React.Consumer<QueueProps> = StatusContext.Consumer;
export const QueueProvider: React.Provider<QueueProps> = StatusContext.Provider;
