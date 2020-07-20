// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

export interface TabItem {
  alias?: string;
  hasParams?: boolean;
  isExact?: boolean;
  isRoot?: boolean;
  name: string;
  text: React.ReactNode;
}
