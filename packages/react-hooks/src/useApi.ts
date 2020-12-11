// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContext } from 'react';

import type { ApiProps } from '@canvas-ui/react-api/types';
import { ApiContext } from '@canvas-ui/react-api';

export default function useApi (): ApiProps {
  return useContext(ApiContext);
}
