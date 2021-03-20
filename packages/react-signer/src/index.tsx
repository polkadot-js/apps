// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueTx, QueueTxMessageSetStatus, QueueTxResult } from '@polkadot/react-components/Status/types';
import type { BareProps as Props } from '@polkadot/react-components/types';
import type { DefinitionRpcExt } from '@polkadot/types/types';

import React, { useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { ApiPromise } from '@polkadot/api';
import { Modal, StatusContext } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { assert, isFunction, loggerFormat } from '@polkadot/util';

import { useTranslation } from './translate';
import TxSigned from './TxSigned';
import TxUnsigned from './TxUnsigned';

interface ItemState {
  count: number;
  currentItem: QueueTx | null;
  isRpc: boolean;
  isVisible: boolean;
  requestAddress: string | null;
}

const AVAIL_STATUS = ['queued', 'qr', 'signing'];

async function submitRpc (api: ApiPromise, { method, section }: DefinitionRpcExt, values: any[]): Promise<QueueTxResult> {
  try {
    const rpc = api.rpc as Record<string, Record<string, (...params: unknown[]) => Promise<unknown>>>;

    assert(isFunction(rpc[section] && rpc[section][method]), `api.rpc.${section}.${method} does not exist`);

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
    count: available.length,
    currentItem,
    isRpc,
    isVisible,
    requestAddress: (currentItem && currentItem.accountId) || null
  };
}

function Signer ({ children, className = '' }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const { queueSetTxStatus, txqueue } = useContext(StatusContext);

  const { count, currentItem, isRpc, isVisible, requestAddress } = useMemo(
    () => extractCurrent(txqueue),
    [txqueue]
  );

  useEffect((): void => {
    isRpc && currentItem &&
      sendRpc(api, queueSetTxStatus, currentItem).catch(console.error);
  }, [api, isRpc, currentItem, queueSetTxStatus]);

  return (
    <>
      {children}
      {currentItem && isVisible && (
        <Modal
          className={className}
          header={<>{t('Authorize transaction')}{(count === 1) ? undefined : <>&nbsp;1/{count}</>}</>}
          key={currentItem.id}
          size='large'
        >
          {currentItem.isUnsigned
            ? <TxUnsigned currentItem={currentItem} />
            : (
              <TxSigned
                currentItem={currentItem}
                requestAddress={requestAddress}
              />
            )
          }
        </Modal>
      )}
    </>
  );
}

export default React.memo(styled(Signer)`
  .signToggle {
    bottom: 1.5rem;
    left: 1.5rem;
    position: absolute;
  }
`);
