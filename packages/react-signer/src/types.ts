// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export interface AddressFlags {
  hardwareType?: string;
  isHardware: boolean;
  isMultisig: boolean;
  isQr: boolean;
  isUnlockable: boolean;
  threshold: number;
  who: string[];
}

export interface AddressProxy {
  isMultiCall: boolean;
  multiRoot: string | null;
  proxyRoot: string | null;
  signAddress: string | null;
  signPassword: string;
}

export interface Signed {
  data: Uint8Array;
  message: Uint8Array;
  signature: Uint8Array;
}
