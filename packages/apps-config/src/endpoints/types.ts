// Copyright 2017-2022 @polkadot/apps-config authors & contributors
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
  text: string;
}

export interface LinkOption extends Option {
  dnslink?: string;
  genesisHash?: string;
  genesisHashRelay?: string;
  homepage?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isLightClient?: boolean;
  isRelay?: boolean;
  isUnreachable?: boolean;
  isSpaced?: boolean;
  linked?: LinkOption[];
  paraId?: number;
  summary?: string;
  teleport?: number[];
  textBy: string;
  textRelay?: React.ReactNode;
  value: string;
  valueRelay?: string[];
}
