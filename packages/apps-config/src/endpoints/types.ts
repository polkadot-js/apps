// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type React from 'react';
import type { IconTheme } from '@polkadot/react-identicon/types';
import type { HexString } from '@polkadot/util/types';
import type { Option } from '../settings/types.js';

interface BaseOption {
  dnslink?: string;
  /**
   * Genesis hash for chain
   */
  genesisHash?: HexString;
  /**
   * Homepage Url
   */
  homepage?: string;
  /**
   * Parachain Id of chain
   */
  paraId?: number;
  /**
   * Summary about chain
   */
  summary?: string;
  teleport?: number[];
  ui: {
    /**
     * Color for chain
     */
    color?: string;
    /**
     * Identicon type i.e. polkadot, beachball, ethereum etc
     */
    identityIcon?: IconTheme;
    /**
     * Logo component for chain
     */
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
  /**
   * Checks whether one of the given provider is reachable or not. If set to true, it hides the chain from explorer.
   */
  isUnreachable?: boolean;
  /**
   * Declares list of all linked chains. However, It is applicable for relay chains only.
   */
  linked?: EndpointOption[];
  info?: string;
  /**
   * Declares the list of all RPC providers
   */
  providers: Record<string, `${'wss://' | 'light://substrate-connect/'}${string}`>;
  /**
   * Declares chain name
   */
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
