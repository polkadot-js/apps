// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '../types';

import React from 'react';

const Context: React.Context<ApiProps> = React.createContext({} as ApiProps);
const ApiConsumer: React.Consumer<ApiProps> = Context.Consumer;
const ApiProvider: React.Provider<ApiProps> = Context.Provider;

export default Context;

export {
  ApiConsumer,
  ApiProvider
};
