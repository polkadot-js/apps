// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps } from './types';

import React from 'react';

export const ApiContext: React.Context<ApiProps> = React.createContext({} as unknown as ApiProps);
export const ApiConsumer: React.Consumer<ApiProps> = ApiContext.Consumer;
export const ApiProvider: React.Provider<ApiProps> = ApiContext.Provider;
