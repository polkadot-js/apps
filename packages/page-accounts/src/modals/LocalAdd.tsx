// Copyright 2017-2024 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Blockchain } from '@acala-network/chopsticks-core';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ModalProps } from '../types.js';

import { setStorage } from '@acala-network/chopsticks-core';
import React, { useCallback, useState } from 'react';
import store from 'store';

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
  name: string;
  tags?: string[];
  balance?: number;
}

export async function createLocalAccount (chain: Blockchain, address: string, { balance = 1000, name }: CreateOptions): Promise<ActionStatus> {
  const status = { action: 'create' } as ActionStatus;
  const existing = store.get('localAccounts') as { address: string, name: string, balance: number }[] | undefined;

  try {
    await setStorage(chain, {
      System: {
        Account: [
          ...(existing || []).map((account) => {
            return [[account.address], { data: { free: account.balance * 1e12 }, providers: 1 }];
          }),
          [[address], { data: { free: balance * 1e12 }, providers: 1 }]
        ]
      }
    });

    keyring.addExternal(address, { isLocal: true, name, tags: ['local'] });

    store.set('localAccounts', [
      ...(existing || []),
      { address, balance, name }
    ]);

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

  const _createLocalAccount = useCallback(
    async () => {
      if (!address || !chain) {
        return;
      }

      const options = { balance: 1000, name: name.trim() };
      const status = await createLocalAccount(chain, address, options);

      onStatusChange(status);
      onClose();
    },
    [address, name, chain, onClose, onStatusChange]
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
        <Modal.Columns hint={t('Any address, this can override accounts in other sections')}>
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
