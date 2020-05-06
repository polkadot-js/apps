// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useState } from 'react';
import { AddressRow, Button, Modal, Password } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  address: string;
  onClose: () => void;
}

interface NewPass {
  isNewValid: boolean;
  newPass: string;
}

interface OldPass {
  isOldValid: boolean;
  oldPass: string;
}

function ChangePass ({ address, className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ isNewValid, newPass }, setNewPass] = useState<NewPass>({ isNewValid: false, newPass: '' });
  const [{ isOldValid, oldPass }, setOldPass] = useState<OldPass>({ isOldValid: false, oldPass: '' });

  const _onChangeNew = useCallback(
    (newPass: string) =>
      setNewPass({ isNewValid: keyring.isPassValid(newPass), newPass }),
    []
  );

  const _onChangeOld = useCallback(
    (oldPass: string) =>
      setOldPass({ isOldValid: keyring.isPassValid(oldPass), oldPass }),
    []
  );

  const _doChange = useCallback(
    (): void => {
      const account = address && keyring.getPair(address);

      if (!account) {
        return;
      }

      try {
        if (!account.isLocked) {
          account.lock();
        }

        account.decodePkcs8(oldPass);
      } catch (error) {
        setOldPass((state: OldPass) => ({ ...state, isOldValid: false }));

        return;
      }

      try {
        keyring.encryptAccount(account, newPass);
      } catch (error) {
        setNewPass((state: NewPass) => ({ ...state, isNewValid: false }));

        return;
      }

      onClose();
    },
    [address, newPass, oldPass, onClose]
  );

  return (
    <Modal
      className={`${className} app--accounts-Modal`}
      header={t('Change account password')}
    >
      <Modal.Content>
        <AddressRow
          isInline
          value={address}
        >
          <p>{t('This will apply to any future use of this account as stored on this browser. Ensure that you securely store this new password and that it is strong and unique to the account.')}</p>
          <div>
            <Password
              autoFocus
              help={t('The existing account password as specified when this account was created or when it was last changed.')}
              isError={!isOldValid}
              label={t('your current password')}
              onChange={_onChangeOld}
              tabIndex={1}
              value={oldPass}
            />
            <Password
              help={t('The new account password. Once set, all future account unlocks will be performed with this new password.')}
              isError={!isNewValid}
              label={t('your new password')}
              onChange={_onChangeNew}
              onEnter={_doChange}
              tabIndex={2}
              value={newPass}
            />
          </div>
        </AddressRow>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='sign-in'
          isDisabled={!isNewValid || !isOldValid}
          isPrimary
          label={t('Change')}
          onClick={_doChange}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(ChangePass);
