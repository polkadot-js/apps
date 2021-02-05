// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import store from 'store';

import { isBoolean } from '@polkadot/util';

type Flags = Record<string, boolean>;

type Setters<T extends Flags> = Record<keyof T, (value: boolean) => void>;

type State<T extends Flags> = [T, Setters<T>];

function getInitial <T extends Flags> (storageKey: string, initial: T): T {
  const saved = store.get(`flags:${storageKey}`, {}) as T;

  return Object.keys(initial).reduce((result, key: keyof T): T => {
    if (isBoolean(saved[key])) {
      result[key] = saved[key];
    }

    return result;
  }, { ...initial });
}

function getSetters <T extends Flags> (flags: T, setFlags: React.Dispatch<React.SetStateAction<T>>): Setters<T> {
  const setFlag = (key: keyof T) =>
    (value: boolean) =>
      setFlags((state) => ({ ...state, [key]: value }));

  return Object.keys(flags).reduce((setters, key: keyof T): Setters<T> => {
    setters[key] = setFlag(key);

    return setters;
  }, {} as Setters<T>);
}

export function useSavedFlags <T extends Flags> (storageKey: string, initial: T): State<T> {
  const [flags, setFlags] = useState(() => getInitial(storageKey, initial));
  const [setters] = useState(() => getSetters(initial, setFlags));

  useEffect(
    (): void => {
      store.set(`flags:${storageKey}`, flags);
    },
    [flags, storageKey]
  );

  return [flags, setters];
}
