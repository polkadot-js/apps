// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import { Input, Modal } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/react-components/translate';

import PasswordInput from './PasswordInput';

interface AccountName {
  name: string;
  isNameValid: boolean;
}

interface AccountPassword {
  password: string;
  isPasswordValid: boolean;
}

interface Props {
  name: AccountName;
  onCommit: () => void;
  setName: (value: AccountName) => void;
  setPassword: (value: AccountPassword) => void;
}

const CreateAccountInputs = ({ name: { isNameValid, name }, onCommit, setName, setPassword }: Props) => {
  const { t } = useTranslation();

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: !!name.trim(), name }),
    [setName]
  );

  const _onChangePass = useCallback(
    (password: string, isValid: boolean) => setPassword({ isPasswordValid: isValid, password }),
    [setPassword]
  );

  return (
    <>
      <Modal.Columns hint={t<string>('The name for this account and how it will appear under your addresses. With an on-chain identity, it can be made available to others.')}>
        <Input
          className='full'
          help={t<string>('Name given to this account. You can edit it. To use the account to validate or nominate, it is a good practice to append the function of the account in the name, e.g "name_you_want - stash".')}
          isError={!isNameValid}
          label={t<string>('name')}
          onChange={_onChangeName}
          onEnter={onCommit}
          placeholder={t<string>('new account')}
          value={name}
        />
      </Modal.Columns>
      <PasswordInput
        onChange={_onChangePass}
        onEnter={onCommit}
      />
    </>
  );
};

export default React.memo(CreateAccountInputs);
