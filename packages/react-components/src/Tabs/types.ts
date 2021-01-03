// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export interface TabItem {
  alias?: string;
  count?: number;
  hasParams?: boolean;
  isExact?: boolean;
  isRoot?: boolean;
  name: string;
  text: React.ReactNode;
}
