// Copyright 2017-2022 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { EventRecord, ExtrinsicStatus } from '@polkadot/types/interfaces';

import { waitFor } from '../utils/waitFor';

export async function execute (extrinsic: SubmittableExtrinsic<'promise'>, singer: KeyringPair, logger = { info: console.log }): Promise<void> {
  let currentTxDone = false;

  function sendStatusCb ({ events = [], status }: { events?: EventRecord[], status: ExtrinsicStatus; }) {
    if (status.isInvalid) {
      logger.info('Transaction invalid');
      currentTxDone = true;
    } else if (status.isReady) {
      logger.info('Transaction is ready');
    } else if (status.isBroadcast) {
      logger.info('Transaction has been broadcasted');
    } else if (status.isInBlock) {
      logger.info('Transaction is in block');
    } else if (status.isFinalized) {
      logger.info(`Transaction has been included in blockHash ${status.asFinalized.toHex()}`);
      events.forEach(
        ({ event }) => {
          if (event.method === 'ExtrinsicSuccess') {
            logger.info('Transaction succeeded');
          } else if (event.method === 'ExtrinsicFailed') {
            logger.info('Transaction failed');
          }
        }
      );
      currentTxDone = true;
    }
  }

  await extrinsic.signAndSend(singer, sendStatusCb);
  await waitFor(() => currentTxDone, { timeout: 20000 });
}
