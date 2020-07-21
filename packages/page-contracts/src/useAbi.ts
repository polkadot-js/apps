// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';

import { useCallback, useEffect, useState } from 'react';
import { Abi } from '@polkadot/api-contract';
import { registry } from '@polkadot/react-api';
import { u8aToString } from '@polkadot/util';

import store from './store';
import { useTranslation } from './translate';

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

interface ContractABIOutdated {
  deploy?: any;
  messages?: any;
}

export default function useAbi (initialValue: [string | null, Abi | null] = [null, null], codeHash: StringOrNull = null, isRequired = false): UseAbi {
  const { t } = useTranslation();
  const [[abi, contractAbi, isAbiSupplied, isAbiValid], setAbi] = useState<[StringOrNull, Abi | null, boolean, boolean]>([initialValue[0], initialValue[1], !!initialValue[1], !isRequired || !!initialValue[1]]);
  const [[isAbiError, errorText], setError] = useState<[boolean, string | null]>([false, null]);

  useEffect(
    (): void => {
      if (!!initialValue[0] && abi !== initialValue[0]) {
        setAbi([initialValue[0], initialValue[1], !!initialValue[1], !isRequired || !!initialValue[1]]);
      }
    },
    [abi, initialValue, isRequired]
  );

  const onChangeAbi = useCallback(
    (u8a: Uint8Array): void => {
      const json = u8aToString(u8a);

      try {
        const abiOutdated = JSON.parse(json) as ContractABIOutdated;

        if (abiOutdated.deploy || abiOutdated.messages) {
          throw new Error(t('You are using an ABI with an outdated format. Please generate a new one.'));
        }

        setAbi([json, new Abi(registry, JSON.parse(json)), true, true]);
        codeHash && store.saveCode(
          codeHash,
          { abi: json }
        );
      } catch (error) {
        console.error(error);

        setAbi([null, null, false, false]);
        setError([true, error]);
      }
    },
    [codeHash, t]
  );

  const onRemoveAbi = useCallback(
    (): void => {
      setAbi([null, null, false, false]);
      setError([false, null]);

      codeHash && store.saveCode(
        codeHash,
        { abi: null }
      );
    },
    [codeHash]
  );

  return {
    abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi
  };
}
