// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useTranslation } from '@polkadot/app-accounts/translate';
import { Modal, Password } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import React, { Dispatch, SetStateAction, useCallback } from 'react';

type PasswordState = { isPassValid: boolean, password: string }
type PasswordStateHooks = [PasswordState, Dispatch<SetStateAction<PasswordState>>];
type PasswordStates = [PasswordStateHooks, PasswordStateHooks]
type Props = {
  onEnter: ()=> void;
  passwordStates: PasswordStates;
}

export default function PasswordInput ({ onEnter, passwordStates }: Props): React.ReactElement {
  const { t } = useTranslation();
  const [{ isPassValid, password }, setPassword] = passwordStates[0];
  const [{ isPassValid: isPass2Valid, password: password2 }, setPassword2] = passwordStates[1];
  const _onChangePass = useCallback(
    (password: string) => setPassword({ isPassValid: keyring.isPassValid(password), password }),
    [setPassword]
  );

  const _onChangePass2 = useCallback(
    (password2: string) => setPassword2({ isPassValid: keyring.isPassValid(password2) && (password2 === password), password: password2 }),
    [password, setPassword2]
  );

  return (
    <Modal.Columns>
      <Modal.Column>
        <Password
          className='full'
          help={t<string>('This password is used to encrypt your private key. It must be strong and unique! You will need it to sign transactions with this account. You can recover this account using this password together with the backup file (generated in the next step).')}
          isError={!isPassValid}
          label={t<string>('password')}
          onChange={_onChangePass}
          onEnter={onEnter}
          value={password}
        />
        <Password
          className='full'
          help={t<string>('Verify the password entered above.')}
          isError={!isPass2Valid}
          label={t<string>('password (repeat)')}
          onChange={_onChangePass2}
          onEnter={onEnter}
          value={password2}
        />
      </Modal.Column>
      <Modal.Column>
        <p>{t<string>('The password and password confirmation for this account. This is required to authenticate any transactions made and to encrypt the keypair.')}</p>
      </Modal.Column>
    </Modal.Columns>
  );
}
