// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ModalProps } from '../types.js';

import React, { useCallback, useState } from 'react';

import { Button, Input, InputAddressSimple, Modal } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';

import { useTranslation } from '../translate.js';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface CreateOptions {
  name: string;
  tags?: string[];
}

export function createLocalAccount (address: string, { name }: CreateOptions): ActionStatus {
  const status = { action: 'create' } as ActionStatus;

  try {
    keyring.addExternal(address, { isLocal: true, name, tags: ['local'] });

    status.account = address;
    status.status = 'success';
    status.message = 'Local account created.';
  } catch (error) {
    status.status = 'error';
    status.message = (error as Error).message;
  }

  return status;
}

function LocalAdd ({ className = '', onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [address, setAdress] = useState<string | null>(null);

  const _createLocalAccount = useCallback(
    () => {
      if (!address) {
        return;
      }

      const options = { name: name.trim() };
      const status = createLocalAccount(address, options);

      onStatusChange(status);
      onClose();
    },
    [address, name, onClose, onStatusChange]
  );

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: (name.trim().length >= 3), name }),
    []
  );

  const isValid = isNameValid && !!address;

  return (
    <Modal
      className={className}
      header={t('Add a mock account to chopsticks')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('Any address, this can override other accounts')}>
          <InputAddressSimple
            autoFocus
            label={t('address')}
            onChange={setAdress}
            placeholder={t('e.g. 5Gg3...')}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The name for this account')}>
          <Input
            className='full'
            isError={!isNameValid}
            label={t('name')}
            onChange={_onChangeName}
            placeholder={t('local account name')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='plus'
          isDisabled={!isValid}
          label={t('Add')}
          onClick={_createLocalAccount}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(LocalAdd);
