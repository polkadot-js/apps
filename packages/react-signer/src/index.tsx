// Copyright 2017-2025 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { QueueTx, QueueTxMessageSetStatus, QueueTxResult } from '@polkadot/react-components/Status/types';
import type { BareProps as Props } from '@polkadot/react-components/types';
import type { DefinitionRpcExt } from '@polkadot/types/types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Modal, styled } from '@polkadot/react-components';
import { useApi, useQueue } from '@polkadot/react-hooks';
import { assert, isFunction, loggerFormat } from '@polkadot/util';

import { useTranslation } from './translate.js';
import TxSigned from './TxSigned.js';
import TxUnsigned from './TxUnsigned.js';

export * from './signers/index.js';

interface ItemState {
  currentItem: QueueTx | null;
  isRpc: boolean;
  isVisible: boolean;
  queueSize: number;
  requestAddress: string | null;
}

const NOOP = () => undefined;

const AVAIL_STATUS = ['queued', 'qr', 'signing'];

async function submitRpc (api: ApiPromise, { method, section }: DefinitionRpcExt, values: unknown[]): Promise<QueueTxResult> {
  try {
    const rpc = api.rpc as unknown as Record<string, Record<string, (...params: unknown[]) => Promise<unknown>>>;

    assert(isFunction(rpc[section]?.[method]), `api.rpc.${section}.${method} does not exist`);

    const result = await rpc[section][method](...values);

    console.log('submitRpc: result ::', loggerFormat(result));

    return {
      result,
      status: 'sent'
    };
  } catch (error) {
    console.error(error);

    return {
      error: error as Error,
      status: 'error'
    };
  }
}

async function sendRpc (api: ApiPromise, queueSetTxStatus: QueueTxMessageSetStatus, { id, rpc, values = [] }: QueueTx): Promise<void> {
  if (rpc) {
    queueSetTxStatus(id, 'sending');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { error, result, status } = await submitRpc(api, rpc, values);

    queueSetTxStatus(id, status, result, error);
  }
}

function extractCurrent (txqueue: QueueTx[]): ItemState {
  const available = txqueue.filter(({ status }) => AVAIL_STATUS.includes(status));
  const currentItem = available[0] || null;
  let isRpc = false;
  let isVisible = false;

  if (currentItem) {
    if (currentItem.status === 'queued' && !(currentItem.extrinsic || currentItem.payload)) {
      isRpc = true;
    } else if (currentItem.status !== 'signing') {
      isVisible = true;
    }
  }

  return {
    currentItem,
    isRpc,
    isVisible,
    queueSize: available.length,
    requestAddress: (currentItem?.accountId) || null
  };
}

function Signer ({ children, className = '' }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const { queueSetTxStatus, txqueue } = useQueue();
  const [isQueueSubmit, setIsQueueSubmit] = useState(false);

  const { currentItem, isRpc, isVisible, queueSize, requestAddress } = useMemo(
    () => extractCurrent(txqueue),
    [txqueue]
  );

  useEffect((): void => {
    (queueSize === 1) && setIsQueueSubmit(false);
  }, [queueSize]);

  useEffect((): void => {
    isRpc && currentItem &&
      sendRpc(api, queueSetTxStatus, currentItem).catch(console.error);
  }, [api, isRpc, currentItem, queueSetTxStatus]);

  const _onCancel = useCallback(
    (): void => {
      if (currentItem) {
        const { id, signerCb = NOOP, txFailedCb = NOOP } = currentItem;

        queueSetTxStatus(id, 'cancelled');
        signerCb(id, null);
        txFailedCb(null);
      }
    },
    [currentItem, queueSetTxStatus]
  );

  return (
    <>
      {children}
      {currentItem && isVisible && (
        <StyledModal
          className={className}
          header={<>{t('Authorize transaction')}{(queueSize === 1) ? undefined : <>&nbsp;1/{queueSize}</>}</>}
          key={currentItem.id}
          onClose={_onCancel}
          size='large'
        >
          {currentItem.isUnsigned
            ? <TxUnsigned currentItem={currentItem} />
            : (
              <TxSigned
                currentItem={currentItem}
                isQueueSubmit={isQueueSubmit}
                queueSize={queueSize}
                requestAddress={requestAddress}
                setIsQueueSubmit={setIsQueueSubmit}
              />
            )
          }
        </StyledModal>
      )}
    </>
  );
}

const StyledModal = styled(Modal)`
  .signToggle {
    bottom: 1.5rem;
    left: 1.5rem;
    position: absolute;

    .ui--Toggle {
      display: inline-block;

      &+.ui--Toggle {
        margin-left: 1rem;
      }
    }
  }
`;

export default React.memo(Signer);
