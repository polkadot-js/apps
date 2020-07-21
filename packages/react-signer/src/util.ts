// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx, QueueTxMessageSetStatus, QueueTxStatus } from '@polkadot/react-components/Status/types';
import { AddressFlags } from './types';

import { SubmittableResult } from '@polkadot/api';
import keyring from '@polkadot/ui-keyring';

const NOOP = () => undefined;

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

  return {
    hardwareType: pair.meta.hardwareType as string,
    isHardware: !!pair.meta.isHardware,
    isMultisig: !!pair.meta.isMultisig,
    isProxied: !!pair.meta.isProxied,
    isQr: !!pair.meta.isExternal && !pair.meta.isMultisig && !pair.meta.isProxied,
    isUnlockable: !pair.meta.isExternal && !pair.meta.isHardware && !pair.meta.isInjected && pair.isLocked,
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
