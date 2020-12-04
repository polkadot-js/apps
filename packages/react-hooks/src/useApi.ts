// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContext } from 'react';

import type { ApiProps } from '@polkadot/react-api/types';
import { ApiContext } from '@polkadot/react-api';

export function useApi (): ApiProps {
  return useContext(ApiContext);
}
