// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { QueueProps, QueueTx } from './types';

import React from 'react';

const defaultState = {
  queue: [] as Array<QueueTx>
} as QueueProps;

const Context: React.Context<QueueProps> = React.createContext<QueueProps>(defaultState);
const QueueConsumer: React.Consumer<QueueProps> = Context.Consumer;
const QueueProvider: React.Provider<QueueProps> = Context.Provider;

export default Context;

export {
  QueueConsumer,
  QueueProvider
};
