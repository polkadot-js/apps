// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiProps } from '@polkadot/react-api/types';

import { useContext } from 'react';
import { ApiContext } from '@polkadot/react-api';

export default function useApi (): ApiProps {
  return useContext(ApiContext);
}
