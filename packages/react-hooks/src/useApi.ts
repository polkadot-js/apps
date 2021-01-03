// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps } from '@polkadot/react-api/types';

import { useContext } from 'react';

import { ApiContext } from '@polkadot/react-api';

export function useApi (): ApiProps {
  return useContext(ApiContext);
}
