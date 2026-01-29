// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { HexString } from '@polkadot/util/types';
import type { ModalProps } from '../types.js';

import React, { useCallback, useState } from 'react';

import { Button, Input, InputAddressSimple, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import useProxies from '../Accounts/useProxies.js';
import { useTranslation } from '../translate.js';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface CreateOptions {
  genesisHash?: HexString;
  name: string;
  tags?: string[];
}

function createProxy (address: string, { genesisHash, name, tags = [] }: CreateOptions, success: string): ActionStatus {
  // we will fill in all the details below
  const status = { action: 'create' } as ActionStatus;

  try {
    keyring.addExternal(address, { genesisHash, isProxied: true, name, tags });

    status.account = address;
    status.status = 'success';
    status.message = success;
  } catch (error) {
    status.status = 'error';
    status.message = (error as Error).message;
  }

  return status;
}

function ProxyAdd ({ className = '', onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { api, isDevelopment } = useApi();
  const { t } = useTranslation();
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [stashAddress, setStashAddress] = useState<string | null>(null);
  const proxyInfo = useProxies(stashAddress);

  const _createProxied = useCallback(
    (): void => {
      if (stashAddress) {
        const options = { genesisHash: isDevelopment ? undefined : api.genesisHash.toHex(), name: name.trim() };
        const status = createProxy(stashAddress, options, t('added proxy'));

        onStatusChange(status);
        onClose();
      }
    },
    [api.genesisHash, isDevelopment, name, onClose, onStatusChange, stashAddress, t]
  );

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: (name.trim().length >= 3), name }),
    []
  );

  const isValid = isNameValid && !!stashAddress && proxyInfo && !proxyInfo.isEmpty;

  return (
    <Modal
      className={className}
      header={t('Add proxied account')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('The address that has previously setup a proxy to one of the accounts that you control.')}>
          <InputAddressSimple
            autoFocus
            isError={!proxyInfo || proxyInfo.isEmpty}
            label={t('proxied account')}
            onChange={setStashAddress}
            placeholder={t('address being proxied')}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The name is for unique identification of the account in your owner lists.')}>
          <Input
            className='full'
            isError={!isNameValid}
            label={t('name')}
            onChange={_onChangeName}
            placeholder={t('proxied name')}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='plus'
          isDisabled={!isValid}
          label={t('Add')}
          onClick={_createProxied}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(ProxyAdd);
