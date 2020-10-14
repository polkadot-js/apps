// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StringOrNull } from '@polkadot/react-components/types';

import { useCallback, useEffect, useState } from 'react';
import { Abi } from '@polkadot/api-contract';
import { u8aToString } from '@polkadot/util';

import store from './store';

interface UseAbi {
  abi: string | null;
  contractAbi: Abi | null;
  errorText: string | null;
  isAbiError: boolean;
  isAbiValid: boolean;
  isAbiSupplied: boolean;
  onChangeAbi: (u8a: Uint8Array) => void;
  onRemoveAbi: () => void;
}

export default function useAbi (initialValue: [string | null | undefined, Abi | null | undefined] = [null, null], codeHash: StringOrNull = null, isRequired = false): UseAbi {
  const [[abi, contractAbi, isAbiSupplied, isAbiValid], setAbi] = useState<[string | null | undefined, Abi | null | undefined, boolean, boolean]>([initialValue[0], initialValue[1], !!initialValue[1], !isRequired || !!initialValue[1]]);
  const [[isAbiError, errorText], setError] = useState<[boolean, string | null]>([false, null]);

  useEffect(
    (): void => {
      initialValue[0] && abi !== initialValue[0] && setAbi([initialValue[0], initialValue[1], !!initialValue[1], !isRequired || !!initialValue[1]]);
    },
    [abi, initialValue, isRequired]
  );

  const onChangeAbi = useCallback(
    (u8a: Uint8Array): void => {
      const json = u8aToString(u8a);

      try {
        setAbi([json, new Abi(json), true, true]);

        codeHash && store.saveCode(codeHash, { abi: json });
      } catch (error) {
        console.error(error);

        setAbi([null, null, false, false]);
        setError([true, (error as Error).message]);
      }
    },
    [codeHash]
  );

  const onRemoveAbi = useCallback(
    (): void => {
      setAbi([null, null, false, false]);
      setError([false, null]);

      codeHash && store.saveCode(codeHash, { abi: null });
    },
    [codeHash]
  );

  return {
    abi: abi || null,
    contractAbi: contractAbi || null,
    errorText,
    isAbiError,
    isAbiSupplied,
    isAbiValid,
    onChangeAbi,
    onRemoveAbi
  };
}
