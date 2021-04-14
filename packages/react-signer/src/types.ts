// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// and @canvas-ui/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface AddressFlags {
  hardwareType?: string;
  isHardware: boolean;
  isMultisig: boolean;
  isProxied: boolean;
  isQr: boolean;
  isUnlockable: boolean;
  threshold: number;
  who: string[];
}

export interface AddressProxy {
  isMultiCall: boolean;
  isUnlockCached: boolean;
  multiRoot: string | null;
  proxyRoot: string | null;
  signAddress: string | null;
  signPassword: string;
}
