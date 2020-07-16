// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodeStored } from '@polkadot/apps/types';
import { StringOrNull, VoidFn } from '@polkadot/react-components/types';
import { FileState } from './types';

import { useCallback, useEffect, useState } from 'react';
import { Abi } from '@polkadot/api-contract';
import store from '@polkadot/apps/store';
import { registry } from '@polkadot/react-api';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from './translate';

interface UseAbi {
  abi: string | null;
  contractAbi: Abi | null;
  errorText: string | null;
  isAbiError: boolean;
  isAbiValid: boolean;
  isAbiSupplied: boolean;
  onChangeAbi: (_: FileState) => void;
  onRemoveAbi: VoidFn;
}

type State = [StringOrNull, Abi | null, boolean, boolean];

interface ContractABIOutdated {
  deploy?: any;
  messages?: any;
}

export default function useAbi (source: CodeStored | null = null, isRequired = false): UseAbi {
  const { t } = useTranslation();
  const initialState: State = !!source
    ? [source.json.abi || null, source.contractAbi || null, !!source.contractAbi, !isRequired || !!source.contractAbi]
    : [null, null, false, false];
  const [[abi, contractAbi, isAbiSupplied, isAbiValid], setAbi] = useState<[StringOrNull, Abi | null, boolean, boolean]>(initialState);
  const [[isAbiError, errorText], setError] = useState<[boolean, string | null]>([false, null]);

  useEffect(
    (): void => {
      if (!!source?.json?.abi && abi !== source.json.abi) {
        setAbi([source.json.abi, source.contractAbi, !!source.contractAbi, !isRequired || !!source.contractAbi]);
      }
    },
    [abi, source, isRequired]
  );

  const onChangeAbi = useCallback(
    ({ data }: FileState): void => {
      const json = u8aToString(data);

      try {
        const abiOutdated = JSON.parse(json) as ContractABIOutdated;

        if (abiOutdated.deploy || abiOutdated.messages) {
          throw new Error(t('You are using an ABI with an outdated format. Please generate a new one.'));
        }

        setAbi([json, new Abi(registry, JSON.parse(json)), true, true]);
        source?.id && store.saveCode(
          { abi: json },
          source.id
        );
      } catch (error) {
        console.error(error);

        setAbi([null, null, false, false]);
        setError([true, error]);
      }
    },
    [source, t]
  );

  const onRemoveAbi = useCallback(
    (): void => {
      setAbi([null, null, false, false]);
      setError([false, null]);

      source?.id && store.saveCode(
        { abi: null },
        source?.id
      );
    },
    [source]
  );

  return {
    abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi
  };
}
