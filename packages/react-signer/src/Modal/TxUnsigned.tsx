// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx, QueueTxMessageSetStatus, QueueTxResult, QueueTxStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise } from '@polkadot/api';
import { Button, ErrorBoundary, Modal, StatusContext } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { assert, isFunction } from '@polkadot/util';
import { format } from '@polkadot/util/logger';

import { useTranslation } from '../translate';
import Transaction from './Transaction';

interface Props {
  className?: string;
  currentItem: QueueTx;
}

// async function signAndSend (queueSetTxStatus: QueueTxMessageSetStatus, { id, txFailedCb = NOOP, txStartCb = NOOP, txSuccessCb = NOOP, txUpdateCb = NOOP }: QueueTx, tx: SubmittableExtrinsic<'promise'>, pairOrAddress: KeyringPair | string, options: Partial<SignerOptions>): Promise<void> {
//   txStartCb();

//   try {
//     const unsubscribe = await tx.signAndSend(pairOrAddress, options, (result: SubmittableResult): void => {
//       if (!result || !result.status) {
//         return;
//       }

//       const status = result.status.type.toLowerCase() as QueueTxStatus;

//       console.log('signAndSend: updated status ::', JSON.stringify(result));
//       queueSetTxStatus(id, status, result);
//       txUpdateCb(result);

//       if (result.status.isFinalized || result.status.isInBlock) {
//         result.events
//           .filter(({ event: { section } }) => section === 'system')
//           .forEach(({ event: { method } }): void => {
//             if (method === 'ExtrinsicFailed') {
//               txFailedCb(result);
//             } else if (method === 'ExtrinsicSuccess') {
//               txSuccessCb(result);
//             }
//           });
//       } else if (result.isError) {
//         txFailedCb(result);
//       }

//       if (result.isCompleted) {
//         unsubscribe();
//       }
//     });
//   } catch (error) {
//     console.error('signAndSend: error:', error);
//     queueSetTxStatus(id, 'error', {}, error);

//     txFailedCb(null);
//   }
// }

function TxUnsigned ({ className, currentItem }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [, toggleRenderError] = useToggle();

  const _onCancel = useCallback(
    (): void => {
      // nothing
    },
    []
  );

  const _onSend = useCallback(
    (): void => {
      // nothing
    },
    []
  );

  return (
    <>
      <Modal.Content className={className}>
        <ErrorBoundary onError={toggleRenderError}>
          <Transaction
            currentItem={currentItem}
            onError={toggleRenderError}
          />
        </ErrorBoundary>
      </Modal.Content>
      <Modal.Actions onCancel={_onCancel}>
        <Button
          icon='sign-in'
          isPrimary
          label={t('Submit (no signature)')}
          onClick={_onSend}
          tabIndex={2}
        />
      </Modal.Actions>
    </>
  );
}

export default React.memo(styled(TxUnsigned)``);
