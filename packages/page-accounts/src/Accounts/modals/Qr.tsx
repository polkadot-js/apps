// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ModalProps } from '../../types';

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { AddressRow, Button, Input, InputAddress, Modal } from '@polkadot/react-components';
import { QrScanAddress } from '@polkadot/react-qr';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../../translate';

interface Scanned {
  address: string;
  genesisHash: string;
  name?: string;
}

interface Props extends ModalProps {
  className?: string;
}

function QrModal ({ className, onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [scanned, setScanned] = useState<Scanned | null>(null);

  const _onNameChange = useCallback(
    (name: string) => setName({ isNameValid: !!name.trim(), name }),
    []
  );

  const _onScan = useCallback(
    (scanned: Scanned): void => {
      setScanned(scanned);

      if (scanned.name) {
        _onNameChange(scanned.name);
      }
    },
    [_onNameChange]
  );

  const _onSave = useCallback(
    (): void => {
      if (!scanned || !isNameValid) {
        return;
      }

      const { address, genesisHash } = scanned;

      keyring.addExternal(address, { genesisHash, name: name.trim() });
      InputAddress.setLastValue('account', address);

      onStatusChange({
        account: address,
        action: 'create',
        message: t('created account'),
        status: 'success'
      });
      onClose();
    },
    [isNameValid, name, onClose, onStatusChange, scanned, t]
  );

  return (
    <Modal
      className={className}
      header={t('Add account via Qr')}
      size='large'
    >
      <Modal.Content>
        {scanned
          ? (
            <>
              <Modal.Columns>
                <Modal.Column>
                  <AddressRow
                    defaultName={name}
                    noDefaultNameOpacity
                    value={scanned.address}
                  />
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
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
                </Modal.Column>
                <Modal.Column>
                  <p>{t('The local name for this account. Changing this does not affect your on-line identity, so this is only used to indicate the name of the account locally.')}</p>
                </Modal.Column>
              </Modal.Columns>
            </>
          )
          : (
            <Modal.Columns>
              <Modal.Column>
                <div className='qr-wrapper'>
                  <QrScanAddress onScan={_onScan} />
                </div>
              </Modal.Column>
              <Modal.Column>
                <p>{t('Provide the account QR from the module/external application for scanning. One detected as valid, you will be taken to the next step to add the account to your list.')}</p>
              </Modal.Column>
            </Modal.Columns>
          )
        }
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='sign-in'
          isDisabled={!scanned || !isNameValid}
          isPrimary
          label={t('Create')}
          onClick={_onSave}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(QrModal)`
  .qr-wrapper {
    margin: 0 auto;
    max-width: 30rem;
  }
`);
