// Copyright 2017-2024 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Blockchain } from '@acala-network/chopsticks-core';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ModalProps } from '../types.js';

import { setStorage } from '@acala-network/chopsticks-core';
import React, { useCallback, useState } from 'react';

import { Button, Input, InputAddressSimple, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import { useTranslation } from '../translate.js';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface CreateOptions {
  balance: number;
  name: string;
  tags?: string[];
}

export async function createLocalAccount (chain: Blockchain, address: string, { balance, name }: CreateOptions): Promise<ActionStatus> {
  const status = { action: 'create' } as ActionStatus;

  try {
    keyring.addExternal(address, { isLocal: true, name, tags: ['local'] });

    await setStorage(chain, {
      System: {
        Account: [
          [[address], { data: { free: balance * 1e12 }, providers: 1 }]
        ]
      }
    });

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
  const { fork: chain } = useApi();
  const { t } = useTranslation();
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [address, setAdress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');

  const _createLocalAccount = useCallback(
    async () => {
      if (!address || !chain) {
        return;
      }

      const options = { balance: balance ? Number(balance) : 0, name: name.trim() };
      const status = await createLocalAccount(chain, address, options);

      onStatusChange(status);
      onClose();
    },
    [address, name, balance, chain, onClose, onStatusChange]
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
        <Modal.Columns hint={t('Optional. The balance for this account Default to 0.')}>
          <Input
            type='number'
            min={0}
            className='full'
            label={t('balance')}
            onChange={setBalance}
            value={balance}
            placeholder={t('1000')}
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
