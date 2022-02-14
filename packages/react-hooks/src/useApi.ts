// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps } from '@polkadot/react-api/types';

import { useContext } from 'react';

import { ApiContext } from '@polkadot/react-api';

import { createNamedHook } from './createNamedHook';

function useApiImpl (): ApiProps {
  return useContext(ApiContext);
}

export const useApi = createNamedHook('useApi', useApiImpl);
