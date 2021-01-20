// Copyright 2017-2021 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import store from '@canvas-ui/apps/store';
import { Code } from '@canvas-ui/apps/types';
import { useApi } from '@canvas-ui/react-hooks';
import { VoidFn } from '@canvas-ui/react-util/types';
import { useCallback, useEffect, useState } from 'react';

import { Abi } from '@polkadot/api-contract';
import { AnyJson } from '@polkadot/types/types';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from './translate';
import { FileState } from './types';

interface UseAbi {
  abi: Abi | null;
  errorText: string | null;
  isAbiError: boolean;
  isAbiValid: boolean;
  isAbiSupplied: boolean;
  onChangeAbi: (_: FileState) => void;
  onRemoveAbi: VoidFn;
}

type State = [Abi | null, boolean, boolean];

interface AbiSpecOutdated {
  deploy?: any;
  messages?: any;
  registry?: {
    strings?: any;
  }
}

export default function useAbi (source: Code | null = null, isRequired = false): UseAbi {
  const { api } = useApi();
  const { t } = useTranslation();
  const initialState: State = source
    ? [source.abi ? new Abi(source.abi, api.registry.getChainProperties()) : null, !!source?.abi, !isRequired || !!source.abi]
    : [null, false, false];
  const [[abi, isAbiSupplied, isAbiValid], setAbi] = useState<State>(initialState);
  const [[isAbiError, errorText], setError] = useState<[boolean, string | null]>([false, null]);

  useEffect(
    (): void => {
      if (!!source?.abi && abi?.json !== source.abi) {
        setAbi([new Abi(source.abi, api.registry.getChainProperties()), !!source.abi, !isRequired || !!source.abi]);
      }
    },
    [abi, api.registry, source, isRequired]
  );

  const onChangeAbi = useCallback(
    ({ data }: FileState): void => {
      const json = u8aToString(data);

      try {
        const abiOutdated = JSON.parse(json) as AbiSpecOutdated;

        if (abiOutdated.deploy || abiOutdated.messages) {
          throw new Error(t<string>('You are using an ABI with an outdated format. Please generate a new one.'));
        }

        const newAbi = JSON.parse(json) as AnyJson;

        setAbi([new Abi(newAbi, api.registry.getChainProperties()), true, true]);
        setError([false, null]);
        source?.id && store.saveCode(
          { abi: newAbi },
          source.id
        );
      } catch (error) {
        console.error(error);

        setAbi([null, false, false]);
        setError([true, error]);
      }
    },
    [api.registry, source, t]
  );

  const onRemoveAbi = useCallback(
    (): void => {
      setAbi([null, false, false]);
      setError([false, null]);

      source?.id && store.saveCode(
        { abi: null },
        source?.id
      );
    },
    [source]
  );

  return {
    abi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi
  };
}
