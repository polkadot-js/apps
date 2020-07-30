// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { ModalProps } from '../../types';

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { AddressRow, Button, Input, InputAddress, Modal, QrScanAddress } from '@polkadot/react-components';
import { useApi, useIpfs } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import PasswordInput from '../PasswordInput';
import { useTranslation } from '../../translate';

interface Scanned {
  content: string;
  isAddress: boolean;
  genesisHash: string;
  name?: string;
}

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface Address {
  address: string;
  isAddress: boolean;
  scanned: Scanned | null;
}

function QrModal ({ className = '', onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isIpfs } = useIpfs();
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [{ address, isAddress, scanned }, setAddress] = useState<Address>({ address: '', isAddress: false, scanned: null });
  const [{ isPasswordValid, password }, setPassword] = useState({ isPasswordValid: false, password: '' });

  // FIXME This gets passed to the useCallback, so we have excessive creations
  const isValid = !!address && isNameValid && (isAddress || isPasswordValid);

  const _onNameChange = useCallback(
    (name: string) => setName({ isNameValid: !!name.trim(), name }),
    []
  );

  const _onPasswordChange = useCallback(
    (password: string, isPasswordValid: boolean) => setPassword({ isPasswordValid, password }),
    []
  );

  const _onScan = useCallback(
    (scanned: Scanned): void => {
      setAddress({
        address: scanned.isAddress
          ? scanned.content
          : keyring.createFromUri(scanned.content, {}, 'sr25519').address,
        isAddress: scanned.isAddress,
        scanned
      });

      if (scanned.name) {
        _onNameChange(scanned.name);
      }
    },
    [_onNameChange]
  );

  const _onSave = useCallback(
    (): void => {
      if (!scanned || !isValid) {
        return;
      }

      const { content, isAddress } = scanned;
      const meta = {
        genesisHash: scanned.genesisHash || api.genesisHash.toHex(),
        name: name.trim()
      };
      const account = isAddress
        ? keyring.addExternal(content, meta).pair.address
        : keyring.addUri(content, password, meta, 'sr25519').pair.address;

      InputAddress.setLastValue('account', account);

      onStatusChange({
        account,
        action: 'create',
        message: t<string>('created account'),
        status: 'success'
      });
      onClose();
    },
    [api, isValid, name, onClose, onStatusChange, password, scanned, t]
  );

  return (
    <Modal
      className={className}
      header={t<string>('Add account via Qr')}
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
                    value={scanned.content}
                  />
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <Input
                    autoFocus
                    className='full'
                    help={t<string>('Name given to this account. You can change it at any point in the future.')}
                    isError={!isNameValid}
                    label={t<string>('name')}
                    onChange={_onNameChange}
                    onEnter={_onSave}
                    value={name}
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('The local name for this account. Changing this does not affect your on-line identity, so this is only used to indicate the name of the account locally.')}</p>
                </Modal.Column>
              </Modal.Columns>
              {!isAddress && (
                <PasswordInput
                  onChange={_onPasswordChange}
                  onEnter={_onSave}
                  password={password}
                />
              )}
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
                <p>{t<string>('Provide the account QR from the module/external application for scanning. One detected as valid, you will be taken to the next step to add the account to your list.')}</p>
              </Modal.Column>
            </Modal.Columns>
          )
        }
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='sign-in-alt'
          isDisabled={!scanned || !isValid || (isAddress && isIpfs)}
          label={t<string>('Create')}
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
