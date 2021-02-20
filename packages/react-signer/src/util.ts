// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair } from '@polkadot/keyring/types';
import type { QueueTx, QueueTxMessageSetStatus, QueueTxStatus } from '@polkadot/react-components/Status/types';
import type { AddressFlags } from './types';

import { SubmittableResult } from '@polkadot/api';
import { keyring } from '@polkadot/ui-keyring';

const NOOP = () => undefined;
const NO_FLAGS = { accountOffset: 0, addressOffset: 0, isHardware: false, isMultisig: false, isProxied: false, isQr: false, isUnlockable: false, threshold: 0, who: [] };

export const UNLOCK_MINS = 15;

const LOCK_DELAY = UNLOCK_MINS * 60 * 1000;

const lockCountdown: Record<string, number> = {};

export function cacheUnlock (pair: KeyringPair): void {
  lockCountdown[pair.address] = Date.now() + LOCK_DELAY;
}

export function lockAccount (pair: KeyringPair): void {
  if ((Date.now() > (lockCountdown[pair.address] || 0)) && !pair.isLocked) {
    pair.lock();
  }
}

export function extractExternal (accountId: string | null): AddressFlags {
  if (!accountId) {
    return NO_FLAGS;
  }

  let publicKey;

  try {
    publicKey = keyring.decodeAddress(accountId);
  } catch (error) {
    console.error(error);

    return NO_FLAGS;
  }

  const pair = keyring.getPair(publicKey);
  const { isExternal, isHardware, isInjected, isMultisig, isProxied } = pair.meta;
  const isUnlockable = !isExternal && !isHardware && !isInjected;

  if (isUnlockable) {
    const entry = lockCountdown[pair.address];

    if (entry && (Date.now() > entry) && !pair.isLocked) {
      pair.lock();
      lockCountdown[pair.address] = 0;
    }
  }

  return {
    accountOffset: pair.meta.accountOffset as number || 0,
    addressOffset: pair.meta.addressOffset as number || 0,
    hardwareType: pair.meta.hardwareType as string,
    isHardware: !!isHardware,
    isMultisig: !!isMultisig,
    isProxied: !!isProxied,
    isQr: !!isExternal && !isMultisig && !isProxied && !isHardware && !isInjected,
    isUnlockable: isUnlockable && pair.isLocked,
    threshold: (pair.meta.threshold as number) || 0,
    who: ((pair.meta.who as string[]) || []).map(recodeAddress)
  };
}

export function recodeAddress (address: string | Uint8Array): string {
  return keyring.encodeAddress(keyring.decodeAddress(address));
}

export function handleTxResults (handler: 'send' | 'signAndSend', queueSetTxStatus: QueueTxMessageSetStatus, { id, txFailedCb = NOOP, txSuccessCb = NOOP, txUpdateCb = NOOP }: QueueTx, unsubscribe: () => void): (result: SubmittableResult) => void {
  return (result: SubmittableResult): void => {
    if (!result || !result.status) {
      return;
    }

    const status = result.status.type.toLowerCase() as QueueTxStatus;

    console.log(`${handler}: status :: ${JSON.stringify(result)}`);

    queueSetTxStatus(id, status, result);
    txUpdateCb(result);

    if (result.status.isFinalized || result.status.isInBlock) {
      result.events
        .filter(({ event: { section } }) => section === 'system')
        .forEach(({ event: { method } }): void => {
          if (method === 'ExtrinsicFailed') {
            txFailedCb(result);
          } else if (method === 'ExtrinsicSuccess') {
            txSuccessCb(result);
          }
        });
    } else if (result.isError) {
      txFailedCb(result);
    }

    if (result.isCompleted) {
      unsubscribe();
    }
  };
}
