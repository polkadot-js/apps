// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx, QueueTxMessageSetStatus, QueueTxResult, QueueTxStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ErrorBoundary, Modal, StatusContext } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import useCurrentItem from './useCurrentItem';

interface Props {
  className?: string;
}

function SignerModal ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { queueSetTxStatus, txqueue } = useContext(StatusContext);
  const [cancelItem, currentItem] = useCurrentItem();

  if (!currentItem) {
    return null;
  }

  return (
    <Modal
      className={className}
      header={t<string>('Authorize transaction')}
      size='large'
    >
      <Modal.Content className='ui--signer-Signer-Content'>
        <ErrorBoundary>
          content
        </ErrorBoundary>
      </Modal.Content>
      <Modal.Actions onCancel={cancelItem}>
        button
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(SignerModal);
