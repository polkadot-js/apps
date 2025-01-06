// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CodeStored } from './types.js';

import React, { useCallback } from 'react';

import { Button, Modal } from '@polkadot/react-components';

import CodeRow from './shared/CodeRow.js';
import { useTranslation } from './translate.js';

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
      header={t('Confirm ABI removal')}
      onClose={onClose}
    >
      <Modal.Content>
        <CodeRow
          code={code}
          isInline
        >
          <p>{t('You are about to remove this code\'s ABI. Once completed, should you need to access it again, you will have to manually re-upload it.')}</p>
          <p>{t('This operation does not impact the associated on-chain code or any of its contracts.')}</p>
        </CodeRow>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='trash'
          label={t('Remove')}
          onClick={_onRemove}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RemoveABI);
