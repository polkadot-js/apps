// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '../settings/types';

export interface EndpointOption {
  dnslink?: string;
  genesisHash?: string;
  homepage?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isDisabled?: boolean;
  isUnreachable?: boolean;
  linked?: EndpointOption[];
  info?: string;
  paraId?: number;
  providers: Record<string, string>;
  summary?: string;
  teleport?: number[];
  text: React.ReactNode;
}

export interface LinkOption extends Option {
  dnslink?: string;
  genesisHash?: string;
  genesisHashRelay?: string;
  homepage?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isRelay?: boolean;
  isUnreachable?: boolean;
  isSpaced?: boolean;
  linked?: LinkOption[];
  paraId?: number;
  summary?: string;
  teleport?: number[];
  textBy: string;
  value: string;
}
