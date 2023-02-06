// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export interface Network {
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
  }[];
  ui: {
    color?: string;
    logo?: string;
  }
}

export interface Group {
  header: React.ReactNode;
  isDevelopment?: boolean;
  isSpaced?: boolean;
  networks: Network[];
}
