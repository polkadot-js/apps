// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueProps, QueueStatus, QueueTx } from './types';

import React from 'react';

const defaultState = {
  stqueue: [] as QueueStatus[],
  txqueue: [] as QueueTx[]
} as QueueProps;

const Context: React.Context<QueueProps> = React.createContext<QueueProps>(defaultState);
const QueueConsumer: React.Consumer<QueueProps> = Context.Consumer;
const QueueProvider: React.Provider<QueueProps> = Context.Provider;

export default Context;

export {
  QueueConsumer,
  QueueProvider
};
