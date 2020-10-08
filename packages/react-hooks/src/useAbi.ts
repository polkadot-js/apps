// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Code } from '@canvas-ui/apps/types';
import { VoidFn } from '@canvas-ui/react-util/types';
import { AnyJson } from '@polkadot/types/types';
import { FileState } from './types';

import { useCallback, useEffect, useState } from 'react';
import { InkAbi } from '@canvas-ui/api-contract';
import store from '@canvas-ui/apps/store';
import { registry } from '@canvas-ui/react-api';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from './translate';

interface UseAbi {
  abi: InkAbi | null;
  errorText: string | null;
  isAbiError: boolean;
  isAbiValid: boolean;
  isAbiSupplied: boolean;
  onChangeAbi: (_: FileState) => void;
  onRemoveAbi: VoidFn;
}

type State = [InkAbi | null, boolean, boolean];

interface InkAbiSpecOutdated {
  deploy?: any;
  messages?: any;
  registry?: {
    strings?: any;
  }
}

export default function useAbi (source: Code | null = null, isRequired = false): UseAbi {
  const { t } = useTranslation();
  const initialState: State = source
    ? [new InkAbi(registry, source.abi || null), !!source?.abi, !isRequired || !!source.abi]
    : [null, false, false];
  const [[abi, isAbiSupplied, isAbiValid], setAbi] = useState<State>(initialState);
  const [[isAbiError, errorText], setError] = useState<[boolean, string | null]>([false, null]);

  useEffect(
    (): void => {
      if (!!source?.abi && abi?.json !== source.abi) {
        setAbi([new InkAbi(registry, source.abi || null), !!source.abi, !isRequired || !!source.abi]);
      }
    },
    [abi, source, isRequired]
  );

  const onChangeAbi = useCallback(
    ({ data }: FileState): void => {
      const json = u8aToString(data);

      try {
        const abiOutdated = JSON.parse(json) as InkAbiSpecOutdated;

        if (abiOutdated.deploy || abiOutdated.messages) {
          throw new Error(t<string>('You are using an ABI with an outdated format. Please generate a new one.'));
        }

        const newAbi = JSON.parse(json) as AnyJson;

        setAbi([new InkAbi(registry, newAbi), true, true]);
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
    [source, t]
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
