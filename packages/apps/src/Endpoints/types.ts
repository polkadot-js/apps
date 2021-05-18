// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export interface Network {
  genesisHash?: string;
  genesisHashRelay?: string;
  icon?: string;
  isChild?: boolean;
  isRelay?: boolean;
  name: string;
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
