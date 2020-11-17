// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StringOrNull } from '@polkadot/react-components/types';

import { useCallback, useEffect, useState } from 'react';
import { Abi } from '@polkadot/api-contract';
import { api } from '@polkadot/react-api';
import { u8aToString } from '@polkadot/util';

import store from './store';

interface UseAbi {
  abi: string | null;
  abiName: string | null;
  contractAbi: Abi | null;
  errorText: string | null;
  isAbiError: boolean;
  isAbiValid: boolean;
  isAbiSupplied: boolean;
  onChangeAbi: (u8a: Uint8Array, name: string) => void;
  onRemoveAbi: () => void;
}

export default function useAbi (initialValue: [string | null | undefined, Abi | null | undefined] = [null, null], codeHash: StringOrNull = null, isRequired = false): UseAbi {
  const [[abi, contractAbi, isAbiSupplied, isAbiValid, abiName], setAbi] = useState<[string | null | undefined, Abi | null | undefined, boolean, boolean, string | null]>([initialValue[0], initialValue[1], !!initialValue[1], !isRequired || !!initialValue[1], null]);
  const [[isAbiError, errorText], setError] = useState<[boolean, string | null]>([false, null]);

  useEffect(
    (): void => {
      initialValue[0] && abi !== initialValue[0] && setAbi([initialValue[0], initialValue[1], !!initialValue[1], !isRequired || !!initialValue[1], null]);
    },
    [abi, initialValue, isRequired]
  );

  const onChangeAbi = useCallback(
    (u8a: Uint8Array, name: string): void => {
      const json = u8aToString(u8a);

      try {
        setAbi([json, new Abi(json, api.registry.getChainProperties()), true, true, name.replace('.contract', '').replace('.json', '').replace('_', ' ')]);

        codeHash && store.saveCode(codeHash, { abi: json });
      } catch (error) {
        console.error(error);

        setAbi([null, null, false, false, null]);
        setError([true, (error as Error).message]);
      }
    },
    [codeHash]
  );

  const onRemoveAbi = useCallback(
    (): void => {
      setAbi([null, null, false, false, null]);
      setError([false, null]);

      codeHash && store.saveCode(codeHash, { abi: null });
    },
    [codeHash]
  );

  return {
    abi: abi || null,
    abiName,
    contractAbi: contractAbi || null,
    errorText,
    isAbiError,
    isAbiSupplied,
    isAbiValid,
    onChangeAbi,
    onRemoveAbi
  };
}
