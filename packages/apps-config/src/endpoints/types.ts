// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { Option } from '../settings/types.js';

/**
 *  The only supported Xcm versions for teleport are V2 and V1 right now.
 *  Be sure to update teleport when introducing a new Xcm version.
 */
export type TeleportXcmVersion = 'V1' | 'V2';

interface BaseOption {
  dnslink?: string;
  genesisHash?: string;
  homepage?: string;
  paraId?: number;
  summary?: string;
  teleport?: number[];
  teleportXcmVersion?: TeleportXcmVersion;
  ui: {
    color?: string;
    logo?: string;
  }
}

export interface EndpointOption extends BaseOption {
  isChild?: boolean;
  isDevelopment?: boolean;
  isDisabled?: boolean;
  isUnreachable?: boolean;
  linked?: EndpointOption[];
  info?: string;
  providers: Record<string, string>;
  text: string;
}

export interface LinkOption extends BaseOption, Option {
  genesisHashRelay?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isLightClient?: boolean;
  isRelay?: boolean;
  isUnreachable?: boolean;
  isSpaced?: boolean;
  linked?: LinkOption[];
  textBy: string;
  textRelay?: React.ReactNode;
  value: string;
  valueRelay?: string[];
}
