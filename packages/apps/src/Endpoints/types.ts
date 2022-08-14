// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export interface Network {
  icon?: string;
  isChild?: boolean;
  isLightClient?: boolean;
  isRelay?: boolean;
  isUnreachable?: boolean;
  name: string;
  nameRelay?: string;
  paraId?: number;
  providers: {
    name: string;
    url: string;
  }[]
}

export interface Group {
  header: React.ReactNode;
  isDevelopment?: boolean;
  isSpaced?: boolean;
  networks: Network[];
}
