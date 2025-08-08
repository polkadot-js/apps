// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';

export interface IFavoriteChainProps {
  chainName: string;
  relay?: string;
  paraId?: number;
}

export type IFavoriteChainsStorage = Record<string, {relay: string, paraId: number}[]>

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
