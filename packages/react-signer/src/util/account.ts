// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import keyring from '@polkadot/ui-keyring';

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
