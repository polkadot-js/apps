// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ModalProps } from '../types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { AddressRow, Button, Input, InputAddress, Modal } from '@polkadot/react-components';
import { QrScanAddress } from '@polkadot/react-qr';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

interface Scanned {
  address: string;
  genesisHash: string;
}

interface Props extends I18nProps, ModalProps {
  className?: string;
}

function QrModal ({ className, onClose, onStatusChange, t }: Props): React.ReactElement<Props> {
  const [name, setName] = useState('');
  const [scanned, setScanned] = useState<Scanned | null>(null);
  const isNameValid = !!name;

  const _onNameChange = (name: string): void => setName(name.trim());
  const _onSave = (): void => {
    if (!scanned || !isNameValid) {
      return;
    }

    const { address, genesisHash } = scanned;

    keyring.addExternal(address, { genesisHash, name });
    InputAddress.setLastValue('account', address);

    onStatusChange({
      account: address,
      action: 'create',
      message: t('created account'),
      status: 'success'
    });
    onClose();
  };

  return (
    <Modal
      className={className}
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Add account via Qr')}</Modal.Header>
      <Modal.Content>
        {
          scanned
            ? (
              <>
                <AddressRow
                  defaultName={name}
                  noDefaultNameOpacity
                  value={scanned.address}
                />
                <Input
                  autoFocus
                  className='full'
                  help={t('Name given to this account. You can change it at any point in the future.')}
                  isError={!isNameValid}
                  label={t('name')}
                  onChange={_onNameChange}
                  onEnter={_onSave}
                  value={name}
                />
              </>
            )
            : (
              <div className='qr-wrapper'>
                <QrScanAddress onScan={setScanned} />
              </div>
            )
        }
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            icon='cancel'
            isNegative
            label={t('Cancel')}
            onClick={onClose}
          />
          <Button.Or />
          <Button
            icon='sign-in'
            isDisabled={!scanned || !isNameValid}
            isPrimary
            onClick={_onSave}
            label={t('Create')}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(
  styled(QrModal)`
    .qr-wrapper {
      margin: 0 auto;
      max-width: 30rem;
    }
  `
);
