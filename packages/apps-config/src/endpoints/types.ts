// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Endpoint } from '../../../../../ui/packages/ui-settings/src/types';

export interface EndpointOption {
  dnslink?: string;
  genesisHash?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isDisabled?: boolean;
  linked?: EndpointOption[];
  info?: string;
  paraId?: number;
  providers: Record<string, Endpoint>;
  text: React.ReactNode;
}
