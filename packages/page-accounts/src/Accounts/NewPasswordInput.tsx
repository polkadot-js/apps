// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import { PasswordInputNew, PasswordStrength } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import { useTranslation } from '../translate';
import styled from 'styled-components';

type Props = {
  password: string;
  onChange: (password: string, isPasswordValid: boolean) => void;
  className?: string;
}

function NewPasswordInput ({ className, onChange, password }: Props): React.ReactElement {
  const { t } = useTranslation();
  const [isPassValid, setPassValid] = useState<boolean>(false);
  const [{ isPass2Valid, password2 }, setPassword2] = useState({ isPass2Valid: false, password2: '' });

  const _onPasswordChange = useCallback(
    (password: string) => {
      const isPassValid = keyring.isPassValid(password);

      setPassValid(isPassValid);

      const isValid = isPassValid && isPass2Valid;

      onChange(password, isValid);
    },
    [onChange, isPass2Valid]
  );

  const onPassword2Change = useCallback(
    (password2: string) => {
      const isPass2Valid = keyring.isPassValid(password2) && (password2 === password);

      setPassword2({ isPass2Valid, password2 });

      const isValid = isPassValid && isPass2Valid;

      onChange(password, isValid);
    },
    [password, onChange, isPassValid]
  );

  return (
    <div className={className}>
      <div className='ui--Row'>
        <div>
          <PasswordInputNew
            className='full'
            help={t<string>('This password is used to encrypt your private key. It must be strong and unique! You will need it to sign transactions with this account.')}
            isError={!!password && !isPassValid}
            label={t<string>('A new password for this account')}
            onChange={_onPasswordChange}
            value={password}
          />
          <PasswordStrength value={password} />
        </div>
        <PasswordInputNew
          className='full'
          help={t<string>('Verify the password.')}
          isError={!!password2 && !isPass2Valid}
          label={t<string>('Repeat password for verification')}
          onChange={onPassword2Change}
          value={password2}
        />
      </div>
    </div>
  );
}

export default React.memo(styled(NewPasswordInput)`
  .ui--Row {
    display: flex;

    & > * {
      width: 100%;
    }

    & > * + * {
      margin-left: 25px;
    }
  }
`);
