// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useEffect, useState } from 'react';
import keyring from '@polkadot/ui-keyring';

interface PasswordProps {
  password: string;
  setPassword: React.Dispatch<string>;
  isPasswordValid: boolean;
  setIsPasswordValid: React.Dispatch<boolean>;
}

export default function usePassword (): PasswordProps {
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
