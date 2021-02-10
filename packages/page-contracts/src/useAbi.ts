// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';

import { Abi } from '@polkadot/api-contract';
import { api } from '@polkadot/react-api';
import { u8aToString } from '@polkadot/util';

import store from './store';

interface AbiState {
  abi: string | null;
  abiName: string | null;
  contractAbi: Abi | null;
  errorText: string | null;
  isAbiError: boolean;
  isAbiValid: boolean;
  isAbiSupplied: boolean;
}

interface UseAbi extends AbiState {
  onChangeAbi: (u8a: Uint8Array, name: string) => void;
  onRemoveAbi: () => void;
}

function fromInitial (initialValue: [string | null | undefined, Abi | null | undefined], isRequired: boolean): AbiState {
  return {
    abi: initialValue[0] || null,
    abiName: null,
    contractAbi: initialValue[1] || null,
    errorText: null,
    isAbiError: false,
    isAbiSupplied: !!initialValue[1],
    isAbiValid: !isRequired || !!initialValue[1]
  };
}

const EMPTY: AbiState = {
  abi: null,
  abiName: null,
  contractAbi: null,
  errorText: null,
  isAbiError: false,
  isAbiSupplied: false,
  isAbiValid: false
};

export default function useAbi (initialValue: [string | null | undefined, Abi | null | undefined] = [null, null], codeHash: string | null = null, isRequired = false): UseAbi {
  const [state, setAbi] = useState<AbiState>(() => fromInitial(initialValue, isRequired));

  useEffect(
    () => setAbi((state) =>
      initialValue[0] && state.abi !== initialValue[0]
        ? fromInitial(initialValue, isRequired)
        : state
    ),
    [initialValue, isRequired]
  );

  const onChangeAbi = useCallback(
    (u8a: Uint8Array, name: string): void => {
      const json = u8aToString(u8a);

      try {
        setAbi({
          abi: json,
          abiName: name.replace('.contract', '').replace('.json', '').replace('_', ' '),
          contractAbi: new Abi(json, api.registry.getChainProperties()),
          errorText: null,
          isAbiError: false,
          isAbiSupplied: true,
          isAbiValid: true
        });

        codeHash && store.saveCode(codeHash, { abi: json });
      } catch (error) {
        console.error(error);

        setAbi({ ...EMPTY, errorText: (error as Error).message });
      }
    },
    [codeHash]
  );

  const onRemoveAbi = useCallback(
    (): void => {
      setAbi(EMPTY);

      codeHash && store.saveCode(codeHash, { abi: null });
    },
    [codeHash]
  );

  return {
    ...state,
    onChangeAbi,
    onRemoveAbi
  };
}
