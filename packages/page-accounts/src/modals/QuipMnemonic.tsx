// Copyright 2017-2026 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ModalProps } from '../types.js';

import React, { useCallback, useState } from 'react';

import { Button, Input, Modal } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface QuipSignerUiApi {
  importMnemonic: (name: string, mnemonic: string) => Promise<string>;
}

function getQuipSigner (): QuipSignerUiApi | undefined {
  return (globalThis as unknown as { quipSigner?: QuipSignerUiApi }).quipSigner;
}

function QuipMnemonic ({ className = '', onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [mnemonic, setMnemonic] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: name.trim().length >= 3, name }),
    []
  );

  const _onImport = useCallback(
    (): void => {
      const quipSigner = getQuipSigner();

      if (!quipSigner) {
        onStatusChange({ action: 'create', message: t('Quip dev signer is not active'), status: 'error' });

        return;
      }

      setIsBusy(true);

      quipSigner
        .importMnemonic(name.trim(), mnemonic.trim())
        .then((address): void => {
          onStatusChange({ account: address, action: 'create', message: t('Quip account imported'), status: 'success' });
          onClose();
        })
        .catch((error: Error): void => {
          onStatusChange({ action: 'create', message: error.message, status: 'error' });
        })
        .finally(() => setIsBusy(false));
    },
    [mnemonic, name, onClose, onStatusChange, t]
  );

  const isValid = isNameValid && mnemonic.trim().length !== 0;

  return (
    <Modal
      className={className}
      header={t('Import a Quip account from mnemonic')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('The secret phrase (or 0x seed) for the Quip account. Derivation paths are not supported; an optional ///password may be appended.')}>
          <Input
            autoFocus
            className='full'
            isDisabled={isBusy}
            label={t('mnemonic phrase')}
            onChange={setMnemonic}
            placeholder={t('bottom drive obey ...')}
            value={mnemonic}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The name for this account as it should appear in the UI')}>
          <Input
            className='full'
            isDisabled={isBusy}
            isError={!isNameValid}
            label={t('name')}
            onChange={_onChangeName}
            placeholder={t('account name')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='plus'
          isBusy={isBusy}
          isDisabled={!isValid || isBusy}
          label={t('Import')}
          onClick={_onImport}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(QuipMnemonic);