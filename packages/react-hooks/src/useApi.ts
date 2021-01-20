// Copyright 2017-2021 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps } from '@canvas-ui/react-api/types';

import { ApiContext } from '@canvas-ui/react-api';
import { useContext } from 'react';

export default function useApi (): ApiProps {
  return useContext(ApiContext);
}
