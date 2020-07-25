// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ModalProps } from '../../types';

import React, { useCallback, useState } from 'react';
import { Button, Input, InputAddressSimple, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../../translate';
import useProxies from '../useProxies';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface CreateOptions {
  genesisHash?: string;
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
  const { hasOwned } = useProxies(stashAddress);

  const _createProxied = useCallback(
    (): void => {
      if (stashAddress) {
        const options = { genesisHash: isDevelopment ? undefined : api.genesisHash.toString(), name: name.trim() };
        const status = createProxy(stashAddress, options, t<string>('added proxy'));

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

  const isValid = isNameValid && !!stashAddress && hasOwned;

  return (
    <Modal
      className={className}
      header={t<string>('Add proxied account')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddressSimple
              autoFocus
              help={t<string>('The address that you have a valid proxy setup for.')}
              isError={!hasOwned}
              label={t<string>('proxied account')}
              onChange={setStashAddress}
              placeholder={t<string>('stash address')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The address that has previously setup a proxy to one of the accounts that you control.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <Input
              className='full'
              help={t<string>('Name given to this proxied account. You can edit it at any later point in time.')}
              isError={!isNameValid}
              label={t<string>('name')}
              onChange={_onChangeName}
              placeholder={t<string>('proxied name')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The name is for unique identification of the account in your owner lists.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='plus'
          isDisabled={!isValid}
          label={t<string>('Add')}
          onClick={_createProxied}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(ProxyAdd);
