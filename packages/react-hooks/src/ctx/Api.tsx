// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps } from './types.js';

import React from 'react';

export const ApiCtx = React.createContext<ApiProps>({} as unknown as ApiProps);
