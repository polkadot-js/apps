// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CodeStored } from './types';

import React, { useCallback } from 'react';

import { Button, Modal } from '@polkadot/react-components';

import CodeRow from './shared/CodeRow';
import { useTranslation } from './translate';

interface Props {
  code: CodeStored;
  onClose: () => void;
  onRemove: () => void;
}

function RemoveABI ({ code, onClose, onRemove }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const _onRemove = useCallback(
    (): void => {
      onClose && onClose();
      onRemove();
    },
    [onClose, onRemove]
  );

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Confirm ABI removal')}
      onClose={onClose}
    >
      <Modal.Content>
        <CodeRow
          code={code}
          isInline
        >
          <p>{t<string>('You are about to remove this code\'s ABI. Once completed, should you need to access it again, you will have to manually re-upload it.')}</p>
          <p>{t<string>('This operation does not impact the associated on-chain code or any of its contracts.')}</p>
        </CodeRow>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='trash'
          label={t<string>('Remove')}
          onClick={_onRemove}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RemoveABI);
