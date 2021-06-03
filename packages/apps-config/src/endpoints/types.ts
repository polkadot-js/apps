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
  providers: Record<string, Endpoint>;
  text: React.ReactNode;
}

type Endpoint = JsonRpcEndpoint | SubstrateConnectEndpoint;

interface JsonRpcEndpoint {
  type: EndpointType.jrpc;
  url: string;
}

interface SubstrateConnectEndpoint {
  type: EndpointType.substrateconnect;
  chain: string;
}

export enum EndpointType {
  jrpc = 'json-rpc',
  substrateconnect = 'substrate-connect'
}
