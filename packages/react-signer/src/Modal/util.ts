// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AddressFlags } from './types';

import keyring from '@polkadot/ui-keyring';

export function extractExternal (accountId: string | null): AddressFlags {
  if (!accountId) {
    return { isHardware: false, isMultisig: false, isQr: false, isUnlockable: false, threshold: 0, who: [] };
  }

  let publicKey;

  try {
    publicKey = keyring.decodeAddress(accountId);
  } catch (error) {
    console.error(error);

    return { isHardware: false, isMultisig: false, isQr: false, isUnlockable: false, threshold: 0, who: [] };
  }

  const pair = keyring.getPair(publicKey);

  return {
    hardwareType: pair.meta.hardwareType as string,
    isHardware: !!pair.meta.isHardware,
    isMultisig: !!pair.meta.isMultisig,
    isQr: !!pair.meta.isExternal && !pair.meta.isMultisig,
    isUnlockable: !pair.meta.isExternal && !pair.meta.isHardware && !pair.meta.isInjected && pair.isLocked,
    threshold: (pair.meta.threshold as number) || 0,
    who: ((pair.meta.who as string[]) || []).map(recodeAddress)
  };
}

export function recodeAddress (address: string | Uint8Array): string {
  return keyring.encodeAddress(keyring.decodeAddress(address));
}
