// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useCallback, useMemo, useState } from 'react';

type FormField<T> = [
  T | null,
  boolean,
  (_?: T | null) => void
];

function isTruthy<T> (value?: T | null): boolean {
  return !!value;
}

export default function useFormField<T> (defaultValue: T | null, validate: (_?: T | null) => boolean = (): boolean => true): FormField<T> {
  const [value, setValue] = useState<T | null>(defaultValue);
  const isValid = useMemo(
    (): boolean => isTruthy<T>(value) && validate(value),
    [validate, value]
  );
  const setter = useCallback((value?: T | null): void => setValue(value || null), []);

  return [
    value,
    isValid,
    setter
  ];
}
