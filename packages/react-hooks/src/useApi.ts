// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps } from '@polkadot/react-api/types';

import { useContext } from 'react';

import { ApiCtx } from './ctx/Api.js';
import { createNamedHook } from './createNamedHook.js';

function useApiImpl (): ApiProps {
  return useContext(ApiCtx);
}

export const useApi = createNamedHook('useApi', useApiImpl);
