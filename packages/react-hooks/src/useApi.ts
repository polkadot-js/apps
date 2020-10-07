// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiProps } from '@canvas-ui/react-api/types';

import { useContext } from 'react';
import { ApiContext } from '@canvas-ui/react-api';

export default function useApi (): ApiProps {
  return useContext(ApiContext);
}
