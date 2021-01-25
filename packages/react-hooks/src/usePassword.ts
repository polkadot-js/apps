// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';

import { keyring } from '@polkadot/ui-keyring';

interface PasswordProps {
  password: string;
  setPassword: React.Dispatch<string>;
  isPasswordValid: boolean;
  setIsPasswordValid: React.Dispatch<boolean>;
}

export function usePassword (): PasswordProps {
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
