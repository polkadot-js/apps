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

type AbiState = [string | null, Abi | null, boolean, boolean, string | null, boolean, string | null];

function fromInitial (initialValue: [string | null | undefined, Abi | null | undefined], isRequired: boolean): AbiState {
  return [initialValue[0] || null, initialValue[1] || null, !!initialValue[1], !isRequired || !!initialValue[1], null, false, null];
}

export default function useAbi (initialValue: [string | null | undefined, Abi | null | undefined] = [null, null], codeHash: StringOrNull = null, isRequired = false): UseAbi {
  const [[abi, contractAbi, isAbiSupplied, isAbiValid, abiName, isAbiError, errorText], setAbi] = useState<AbiState>(fromInitial(initialValue, isRequired));

  useEffect(
    (): void => {
      initialValue[0] && abi !== initialValue[0] && setAbi(fromInitial(initialValue, isRequired));
    },
    [abi, initialValue, isRequired]
  );

  const onChangeAbi = useCallback(
    (u8a: Uint8Array, name: string): void => {
      const json = u8aToString(u8a);

      try {
        setAbi([json, new Abi(json, api.registry.getChainProperties()), true, true, name.replace('.contract', '').replace('.json', '').replace('_', ' '), false, null]);

        codeHash && store.saveCode(codeHash, { abi: json });
      } catch (error) {
        console.error(error);

        setAbi([null, null, false, false, null, true, (error as Error).message]);
      }
    },
    [codeHash]
  );

  const onRemoveAbi = useCallback(
    (): void => {
      setAbi([null, null, false, false, null, false, null]);

      codeHash && store.saveCode(codeHash, { abi: null });
    },
    [codeHash]
  );

  return {
    abi,
    abiName,
    contractAbi,
    errorText,
    isAbiError,
    isAbiSupplied,
    isAbiValid,
    onChangeAbi,
    onRemoveAbi
  };
}
