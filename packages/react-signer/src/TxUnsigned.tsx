// Copyright 2017-2020 @canvas-ui/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { QueueTx } from '@canvas-ui/react-components/Status/types';

import React from 'react';
import { Button, ErrorBoundary, Modal } from '@canvas-ui/react-components';
import { useToggle } from '@canvas-ui/react-hooks';

import { useTranslation } from './translate';
import Transaction from './Transaction';
import useSendUnsigned from './useSendUnsigned';

interface Props {
  className?: string;
  currentItem: QueueTx;
}

function TxUnsigned ({ className, currentItem }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { onCancel, onSendUnsigned } = useSendUnsigned(currentItem);
  const [isRenderError, toggleRenderError] = useToggle();

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
      <Modal.Actions onCancel={onCancel}>
        <Button
          icon='sign-in'
          isDisabled={isRenderError}
          isPrimary
          label={t<string>('Submit (no signature)')}
          onClick={onSendUnsigned}
          tabIndex={2}
        />
      </Modal.Actions>
    </>
  );
}

export default React.memo(TxUnsigned);
