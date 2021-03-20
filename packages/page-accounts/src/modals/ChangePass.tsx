// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { AddressRow, Button, Modal, Password, PasswordStrength } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  address: string;
  onClose: () => void;
}

interface NewPass {
  isValid: boolean;
  password: string;
}

interface OldPass {
  isOldValid: boolean;
  oldPass: string;
}

function ChangePass ({ address, className = '', onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [newPass1, setNewPass1] = useState<NewPass>({ isValid: false, password: '' });
  const [newPass2, setNewPass2] = useState<NewPass>({ isValid: false, password: '' });
  const [{ isOldValid, oldPass }, setOldPass] = useState<OldPass>({ isOldValid: false, oldPass: '' });

  const _onChangeNew1 = useCallback(
    (password: string) =>
      setNewPass1({ isValid: keyring.isPassValid(password), password }),
    []
  );

  const _onChangeNew2 = useCallback(
    (password: string) =>
      setNewPass2({ isValid: keyring.isPassValid(password) && (newPass1.password === password), password }),
    [newPass1]
  );

  const _onChangeOld = useCallback(
    (oldPass: string) => setOldPass({ isOldValid: keyring.isPassValid(oldPass), oldPass }),
    []
  );

  const _doChange = useCallback(
    (): void => {
      const account = address && keyring.getPair(address);

      if (!account) {
        return;
      }

      setIsBusy(true);
      setTimeout((): void => {
        try {
          if (!account.isLocked) {
            account.lock();
          }

          account.decodePkcs8(oldPass);
        } catch (error) {
          setOldPass((state: OldPass) => ({ ...state, isOldValid: false }));
          setIsBusy(false);

          return;
        }

        try {
          keyring.encryptAccount(account, newPass1.password);
        } catch (error) {
          setNewPass2((state: NewPass) => ({ ...state, isValid: false }));
          setIsBusy(false);

          return;
        }

        setIsBusy(false);
        onClose();
      }, 0);
    },
    [address, newPass1, oldPass, onClose]
  );

  return (
    <Modal
      className={`${className} app--accounts-Modal`}
      header={t<string>('Change account password')}
      size='large'
    >
      <Modal.Content>
        <AddressRow
          isInline
          value={address}
        />
        <Modal.Columns hint={t<string>('The existing account password as specified when this account was created or when it was last changed.')}>
          <Password
            autoFocus
            help={t<string>('The existing account password as specified when this account was created or when it was last changed.')}
            isError={!isOldValid}
            label={t<string>('your current password')}
            onChange={_onChangeOld}
            tabIndex={1}
            value={oldPass}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('This will apply to any future use of this account as stored on this browser. Ensure that you securely store this new password and that it is strong and unique to the account.')}>
          <Password
            help={t<string>('The new account password. Once set, all future account unlocks will be performed with this new password.')}
            isError={!newPass1.isValid}
            label={t<string>('your new password')}
            onChange={_onChangeNew1}
            onEnter={_doChange}
            tabIndex={2}
            value={newPass1.password}
          />
          <Password
            help={t<string>('Verify the password entered above.')}
            isError={!newPass2.isValid}
            label={t<string>('password (repeat)')}
            onChange={_onChangeNew2}
            onEnter={_doChange}
            tabIndex={2}
            value={newPass2.password}
          />
          <PasswordStrength value={newPass1.password} />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='sign-in-alt'
          isBusy={isBusy}
          isDisabled={!newPass1.isValid || !newPass2.isValid || !isOldValid}
          label={t<string>('Change')}
          onClick={_doChange}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(ChangePass);
