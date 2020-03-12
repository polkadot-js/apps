// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';

import { useContext } from 'react';
import { ApiContext } from '@polkadot/react-api';

export default function useApi (): ApiProps {
  return useContext(ApiContext);
}
