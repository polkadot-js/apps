// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx, QueueTxMessageSetStatus, QueueTxResult } from '@polkadot/react-components/Status/types';
import { BareProps as Props } from '@polkadot/react-components/types';
import { DefinitionRpcExt } from '@polkadot/types/types';

import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise } from '@polkadot/api';
import { Modal, StatusContext } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { assert, isFunction } from '@polkadot/util';
import { format } from '@polkadot/util/logger';

import { useTranslation } from './translate';
import TxSigned from './TxSigned';
import TxUnsigned from './TxUnsigned';

interface ItemState {
  currentItem: QueueTx | null;
  requestAddress: string | null;
}

async function submitRpc (api: ApiPromise, { method, section }: DefinitionRpcExt, values: any[]): Promise<QueueTxResult> {
  try {
    const rpc = api.rpc as Record<string, Record<string, (...params: unknown[]) => Promise<unknown>>>;

    assert(isFunction(rpc[section] && rpc[section][method]), `api.rpc.${section}.${method} does not exist`);

    const result = await rpc[section][method](...values);

    console.log('submitRpc: result ::', format(result));

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

function extractCurrent (api: ApiPromise, queueSetTxStatus: QueueTxMessageSetStatus, txqueue: QueueTx[]): ItemState {
  const nextItem = txqueue.find(({ status }) => ['queued', 'qr'].includes(status)) || null;
  let currentItem = null;

  // when the next up is an RPC, send it immediately
  if (nextItem && nextItem.status === 'queued' && !(nextItem.extrinsic || nextItem.payload)) {
    sendRpc(api, queueSetTxStatus, nextItem).catch(console.error);
  } else {
    currentItem = nextItem;
  }

  return {
    currentItem,
    requestAddress: (currentItem && currentItem.accountId) || null
  };
}

function Signer ({ children, className = '' }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const { queueSetTxStatus, txqueue } = useContext(StatusContext);
  const [{ currentItem, requestAddress }, setItem] = useState<ItemState>({ currentItem: null, requestAddress: null });

  useEffect((): void => {
    setItem(extractCurrent(api, queueSetTxStatus, txqueue));
  }, [api, queueSetTxStatus, txqueue]);

  return (
    <>
      {children}
      {currentItem && (
        <Modal
          className={className}
          header={t('Authorize transaction')}
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
