// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx, QueueTxMessageSetStatus, QueueTxResult, QueueTxStatus } from '@polkadot/react-components/Status/types';
import { DefinitionRpcExt, SignerPayloadJSON } from '@polkadot/types/types';

import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise } from '@polkadot/api';
import { ErrorBoundary, Modal, StatusContext } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO, isFunction } from '@polkadot/util';
import { format } from '@polkadot/util/logger';

import { useTranslation } from '../translate';
import AddressOrProxy from './AddressOrProxy';
import Tip from './Tip';
import Transaction from './Transaction';
import Unlock from './Unlock';
import { extractExternal } from './util';

interface Props {
  className?: string;
  currentItem: QueueTx;
  requestAddress: string;
}

function TxSigned ({ className, currentItem, requestAddress }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { queueSetTxStatus } = useContext(StatusContext);
  const [flags, setFlags] = useState(extractExternal(requestAddress));
  const [isRenderError, toggleRenderError] = useToggle();
  const [address, setAddress] = useState<string>(requestAddress);
  const [tip, setTip] = useState(BN_ZERO);

  useEffect((): void => {
    setFlags(extractExternal(address));
  }, [address]);

  const _onCancel = useCallback(
    (): void => {
      const { id, signerCb, txFailedCb } = currentItem;

      queueSetTxStatus(id, 'cancelled');
      isFunction(signerCb) && signerCb(id, null);
      isFunction(txFailedCb) && txFailedCb(null);
    },
    [currentItem, queueSetTxStatus]
  );

  return (
    <>
      <Modal.Content className={className}>
        <ErrorBoundary onError={toggleRenderError}>
          <AddressOrProxy
            onChange={setAddress}
            requestAddress={requestAddress}
          />
          <Transaction
            currentItem={currentItem}
            onError={toggleRenderError}
          />
          <Tip onChange={setTip} />
          <Unlock address={address} />
        </ErrorBoundary>
      </Modal.Content>
      <Modal.Actions onCancel={_onCancel}>

      </Modal.Actions>
    </>
  );
}

export default React.memo(styled(TxSigned)``);
