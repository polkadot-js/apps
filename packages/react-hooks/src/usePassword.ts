// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { keyring } from '@polkadot/ui-keyring';

import { createNamedHook } from './createNamedHook';

interface PasswordProps {
  password: string;
  setPassword: React.Dispatch<string>;
  isPasswordValid: boolean;
  setIsPasswordValid: React.Dispatch<boolean>;
}

function usePasswordImpl (): PasswordProps {
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect((): void => {
    setIsPasswordValid(keyring.isPassValid(password));
  }, [password]);

  return {
    isPasswordValid,
    password,
    setIsPasswordValid,
    setPassword
  };
}

export const usePassword = createNamedHook('usePassword', usePasswordImpl);
