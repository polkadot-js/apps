// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { IconTheme } from '@polkadot/react-identicon/types';
import type { HexString } from '@polkadot/util/types';
import type { Option } from '../settings/types.js';

interface BaseOption {
  dnslink?: string;
  genesisHash?: HexString;
  homepage?: string;
  paraId?: number;
  summary?: string;
  teleport?: number[];
  ui: {
    color?: string;
    identityIcon?: IconTheme;
    logo?: string;
  }
}

export interface EndpointOption extends BaseOption {
  isChild?: boolean;
  isDevelopment?: boolean;
  isDisabled?: boolean;
  /**
   * Declares whether the given endpoint is the People chain used to store identity information.
   */
  isPeople?: boolean;
  isUnreachable?: boolean;
  linked?: EndpointOption[];
  info?: string;
  providers: Record<string, `${'wss://' | 'light://substrate-connect/'}${string}`>;
  text: string;
  /**
   * Declares whether or not the endpoint is a relay chain.
   */
  isRelay?: boolean;
  /**
   * Declares whether the given endpoint uses the People chain to store identity information.
   */
  isPeopleForIdentity?: boolean;
  /**
   * Declares the relays name.
   */
  relayName?: string;
}

export interface LinkOption extends BaseOption, Option {
  genesisHashRelay?: HexString;
  isChild?: boolean;
  isDevelopment?: boolean;
  isLightClient?: boolean;
  isPeople?: boolean;
  isRelay?: boolean;
  isUnreachable?: boolean;
  isSpaced?: boolean;
  linked?: LinkOption[];
  providers?: `${'wss://' | 'light://substrate-connect/'}${string}`[];
  relayName?: string;
  textBy: string;
  textRelay?: React.ReactNode;
  isPeopleForIdentity?: boolean;
  value: string;
  valueRelay?: string[];
}
