// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountFlags } from '../types';

import keyring from '@polkadot/ui-keyring';

export function extractExternal (accountId?: string | null): AccountFlags {
  if (!accountId) {
    return { isExternal: false, isHardware: false, isMultisig: false, threshold: 0, who: [] };
  }

  let publicKey;

  try {
    publicKey = keyring.decodeAddress(accountId);
  } catch (error) {
    console.error(error);

    return { isExternal: false, isHardware: false, isMultisig: false, threshold: 0, who: [] };
  }

  const pair = keyring.getPair(publicKey);

  return {
    hardwareType: pair.meta.hardwareType as string,
    isExternal: !!pair.meta.isExternal,
    isHardware: !!pair.meta.isHardware,
    isMultisig: !!pair.meta.isMultisig,
    threshold: (pair.meta.threshold as number) || 0,
    who: (pair.meta.who as string[]) || []
  };
}

export function unlockAccount (accountId: string, password?: string): string | null {
  let publicKey;

  try {
    publicKey = keyring.decodeAddress(accountId);
  } catch (error) {
    console.error(error);

    return 'unable to decode address';
  }

  const pair = keyring.getPair(publicKey);

  if (!pair.isLocked || pair.meta.isInjected || (pair.meta.isExternal && !pair.meta.isMultisig)) {
    return null;
  }

  try {
    pair.decodePkcs8(password);
  } catch (error) {
    console.error(error);

    return (error as Error).message;
  }

  return null;
}
