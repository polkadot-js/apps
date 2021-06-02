// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '../settings/types';

export interface EndpointOption {
  allowTeleport?: boolean;
  dnslink?: string;
  genesisHash?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isDisabled?: boolean;
  linked?: EndpointOption[];
  info?: string;
  paraId?: number;
  providers: Record<string, string>;
  text: React.ReactNode;
}

export interface LinkOption extends Option {
  allowTeleport?: boolean;
  dnslink?: string;
  genesisHash?: string;
  genesisHashRelay?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isRelay?: boolean;
  isSpaced?: boolean;
  linked?: LinkOption[];
  paraId?: number;
  textBy: string;
}
