// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface EndpointOption {
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
