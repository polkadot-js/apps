// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState } from 'react';

import { Modal, Password, PasswordStrength } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';

import { useTranslation } from '../translate.js';

interface Props {
  onChange: (password: string, isPasswordValid: boolean) => void;
  onEnter: () => void;
}

export default function PasswordInput ({ onChange, onEnter }: Props): React.ReactElement {
  const { t } = useTranslation();
  const [{ isPass1Valid, password1 }, setPassword1] = useState({ isPass1Valid: false, password1: '' });
  const [{ isPass2Valid, password2 }, setPassword2] = useState({ isPass2Valid: false, password2: '' });

  useEffect(
    () => onChange(password1, isPass1Valid && isPass2Valid),
    [password1, onChange, isPass1Valid, isPass2Valid]
  );

  const _onPassword1Change = useCallback(
    (password1: string) => {
      setPassword1({
        isPass1Valid: keyring.isPassValid(password1),
        password1
      });
      setPassword2({
        isPass2Valid: keyring.isPassValid(password2) && (password2 === password1),
        password2
      });
    },
    [password2]
  );

  const onPassword2Change = useCallback(
    (password2: string) => setPassword2({
      isPass2Valid: keyring.isPassValid(password2) && (password2 === password1),
      password2
    }),
    [password1]
  );

  return (
    <Modal.Columns
      hint={
        <>
          <p>{t('The password and password confirmation for this account. This is required to authenticate any transactions made and to encrypt the keypair.')}</p>
          <p>{t('Ensure you are using a strong password for proper account protection.')}</p>
        </>
      }
    >
      <Password
        className='full'
        isError={!isPass1Valid}
        label={t('password')}
        onChange={_onPassword1Change}
        onEnter={onEnter}
        value={password1}
      />
      <Password
        className='full'
        isError={!isPass2Valid}
        label={t('password (repeat)')}
        onChange={onPassword2Change}
        onEnter={onEnter}
        value={password2}
      />
      <PasswordStrength value={password1} />
    </Modal.Columns>
  );
}
