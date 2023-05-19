// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps } from '@polkadot/react-api/types';

import React from 'react';

export const ApiCtx = React.createContext<ApiProps>({} as unknown as ApiProps);
