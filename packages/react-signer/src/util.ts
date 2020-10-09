// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeyringPair } from '@polkadot/keyring/types';
import { QueueTx, QueueTxMessageSetStatus, QueueTxStatus } from '@polkadot/react-components/Status/types';
import { AddressFlags } from './types';

import { SubmittableResult } from '@polkadot/api';
import keyring from '@polkadot/ui-keyring';

const NOOP = () => undefined;

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
    return { isHardware: false, isMultisig: false, isProxied: false, isQr: false, isUnlockable: false, threshold: 0, who: [] };
  }

  let publicKey;

  try {
    publicKey = keyring.decodeAddress(accountId);
  } catch (error) {
    console.error(error);

    return { isHardware: false, isMultisig: false, isProxied: false, isQr: false, isUnlockable: false, threshold: 0, who: [] };
  }

  const pair = keyring.getPair(publicKey);
  const isUnlockable = !pair.meta.isExternal && !pair.meta.isHardware && !pair.meta.isInjected;

  if (isUnlockable) {
    const entry = lockCountdown[pair.address];

    if (entry && (Date.now() > entry) && !pair.isLocked) {
      pair.lock();
      lockCountdown[pair.address] = 0;
    }
  }

  return {
    hardwareType: pair.meta.hardwareType as string,
    isHardware: !!pair.meta.isHardware,
    isMultisig: !!pair.meta.isMultisig,
    isProxied: !!pair.meta.isProxied,
    isQr: !!pair.meta.isExternal && !pair.meta.isMultisig && !pair.meta.isProxied && !pair.meta.isHardware,
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
