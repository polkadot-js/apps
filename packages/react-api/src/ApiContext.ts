// Copyright 2017-2021 @canvas-ui/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { ApiProps } from './types';

const ApiContext: React.Context<ApiProps> = React.createContext({} as unknown as ApiProps);
const ApiConsumer: React.Consumer<ApiProps> = ApiContext.Consumer;
const ApiProvider: React.Provider<ApiProps> = ApiContext.Provider;

export default ApiContext;

export {
  ApiConsumer,
  ApiProvider
};
